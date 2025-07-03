package controllers

import (
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

func (c *Controller) GetRecommendations(ctx *fiber.Ctx) error {
	// Get top rated dishes as recommendations
	dishes, err := c.service.GetTopRatedDishes(ctx.UserContext(), 10)
	if err != nil {
		return fiber.NewError(fiber.StatusInternalServerError, "Failed to fetch recommendations")
	}

	var recommendations []RecommendationResponse
	for _, dish := range dishes {
		price := "$$"
		if dish.Price < 50000 {
			price = "$"
		} else if dish.Price > 200000 {
			price = "$$$"
		}

		restaurantName := dish.RestaurantName
		restaurantUsername := dish.RestaurantUsername

		// Convert average rating to float64 if possible
		var rating float64
		if dish.AverageRating != nil {
			if avgRating, ok := dish.AverageRating.(float64); ok {
				rating = avgRating
			}
		}

		recommendations = append(recommendations, RecommendationResponse{
			ID:                 dish.ID,
			Title:              dish.Name,
			Restaurant:         restaurantName,
			Dish:               dish.Name,
			RestaurantUsername: restaurantUsername,
			Image:              nil, // Image field not available in query
			Rating:             rating,
			ReviewCount:        dish.ReviewCount,
			Price:              price,
			Reason:             "Highly rated by users",
		})
	}

	return ctx.JSON(recommendations)
}
