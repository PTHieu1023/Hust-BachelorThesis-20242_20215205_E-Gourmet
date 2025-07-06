package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"e-gourmet/core/internal/utils"
	"github.com/gofiber/fiber/v2"
)

type RecommendationResponse struct {
	ID                 int32   `json:"id"`
	Title              string  `json:"title"`
	Restaurant         string  `json:"restaurant"`
	Dish               string  `json:"dish"`
	RestaurantUsername string  `json:"restaurantUsername"`
	Image              *string `json:"image"`
	Rating             float64 `json:"rating"`
	ReviewCount        int64   `json:"reviewCount"`
	Price              string  `json:"price"`
	Reason             string  `json:"reason"`
}

type RCMAPIResponse struct {
	UserID          string                   `json:"user_id"`
	Recommendations []map[string]interface{} `json:"recommendations"`
}

func (c *EGControllerImpl) GetRecommendations(ctx *fiber.Ctx) error {
	// Get user ID from context
	userId := ctx.UserContext().Value(utils.AuthUserID)
	if userId == nil {
		return fiber.NewError(fiber.StatusUnauthorized, "User not authenticated")
	}
	userIdStr := userId.(string)

	// Check latest recommendation timestamp
	latestRec, err := c.service.GetLatestUserRecommendation(ctx.UserContext(), userIdStr)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to check latest recommendations")
	}

	// Check if recommendations are older than 1 day or don't exist
	needsRefresh := false
	if latestRec == nil {
		needsRefresh = true
	} else {
		// Try to parse the timestamp
		if timestamp, ok := latestRec.(time.Time); ok {
			oneDayAgo := time.Now().Add(-24 * time.Hour)
			if timestamp.Before(oneDayAgo) {
				needsRefresh = true
			}
		} else {
			// If we can't parse the timestamp, refresh
			needsRefresh = true
		}
	}

	// If recommendations need refresh, call RCM system
	if needsRefresh {
		err := c.callRCMSystemAndSaveRecommendations(ctx, userIdStr)
		if err != nil {
			// Log error but continue with existing recommendations if any
			fmt.Printf("Failed to refresh recommendations from RCM system: %v\n", err)
		}
	}

	// Get current recommendations from database
	recommendations, err := c.service.GetUserRecommendations(ctx.UserContext(), userIdStr)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to get recommendations")
	}

	// Convert to response format
	var response []RecommendationResponse
	for _, rec := range recommendations {
		price := "$$"
		if rec.Price < 50000 {
			price = "$"
		} else if rec.Price > 200000 {
			price = "$$$"
		}

		response = append(response, RecommendationResponse{
			ID:                 rec.DishID,
			Title:              rec.DishName,
			Restaurant:         rec.RestaurantName,
			Dish:               rec.DishName,
			RestaurantUsername: rec.RestaurantUsername,
			Image:              nil,
			Rating:             float64(rec.Score),
			ReviewCount:        0, // Not available in recommendation table
			Price:              price,
			Reason:             "Recommended for you",
		})
	}

	return ctx.JSON(response)
}

func (c *EGControllerImpl) callRCMSystemAndSaveRecommendations(ctx *fiber.Ctx, userId string) error {
	// Call RCM system API
	rcmURL := fmt.Sprintf("http://localhost:8000/api/recommend/%s", userId)

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err := client.Get(rcmURL)
	if err != nil {
		return fmt.Errorf("failed to call RCM system: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("RCM system returned status: %d", resp.StatusCode)
	}

	// Read response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return fmt.Errorf("failed to read RCM response: %w", err)
	}

	// Parse RCM response
	var rcmResponse RCMAPIResponse
	if err := json.Unmarshal(body, &rcmResponse); err != nil {
		return fmt.Errorf("failed to parse RCM response: %w", err)
	}

	// The RCM system already saves recommendations to the database
	// So we don't need to do anything else here

	return nil
}
