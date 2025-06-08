package services

import (
	"context"
	"e-gourmet/core/internal/database"
	"github.com/gofiber/fiber/v2"
	"strings"
	"time"
)

func (s *Service) GetCuisineRecursionById(id int16) (*Cuisine, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	cuisinesRow, err := s.querier.GetCuisineRecursionById(ctx, s.dbtx, id)
	if err != nil {
		return nil, err
	}
	cuisinesMap := make(map[int16]*Cuisine)
	for _, row := range cuisinesRow {
		cuisinesMap[row.ID] = NewCuisine(row.ID, row.Name, row.ParentID, row.ImageUrl)
	}
	for _, cuisine := range cuisinesMap {
		if cuisine.ParentId == nil {
			continue
		}
		parent, exists := cuisinesMap[*cuisine.ParentId]
		if !exists {
			continue
		}
		if parent.Children == nil {
			parent.Children = make(map[int16]*Cuisine)
		}
		parent.Children[cuisine.ID] = cuisine
	}
	return cuisinesMap[id], nil
}

func (s *Service) AddCuisine(params *database.AddCuisineParams) (*Cuisine, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	params.Name = strings.TrimSpace(params.Name)
	if params.Name == "" {
		return nil, fiber.NewError(
			fiber.StatusBadRequest,
			"Cuisine name is required")
	}
	if params.ParentID == nil {
		params.ParentID = new(int16)
		*params.ParentID = 0
	}

	cuisine, err := s.querier.AddCuisine(ctx, s.dbtx, params)
	if err != nil {
		return nil, err
	}
	return NewCuisine(cuisine.ID, cuisine.Name, cuisine.ParentID, cuisine.ImageUrl), nil
}
