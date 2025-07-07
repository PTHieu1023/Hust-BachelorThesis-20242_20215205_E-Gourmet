package controllers

import (
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/utils"
	"e-gourmet/core/pkg/pagination"
	"github.com/gofiber/fiber/v2"
)

func (c *EGControllerImpl) CreateReview(ctx *fiber.Ctx) error {
	params := new(database.CreateReviewParams)
	if err := ctx.BodyParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	params.UserID = new(string)
	*params.UserID = ctx.UserContext().Value(utils.AuthUserID).(string)
	review, err := c.service.CreateReview(ctx.UserContext(), params)
	if err != nil {
		return err
	}
	return ctx.Status(fiber.StatusCreated).JSON(review)
}

func (c *EGControllerImpl) GetReviews(ctx *fiber.Ctx) error {
	params := new(database.GetReviewsParams)

	if err := ctx.QueryParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}

	pageFilter, err := pagination.GetPageFilter(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid pagination parameters")
	}
	params.Limit = int32(pageFilter.Size)
	params.Offset = int32((pageFilter.Page - 1) * pageFilter.Size)

	reviews, err := c.service.GetReviews(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.JSON(reviews)
}

func (c *EGControllerImpl) DeleteReview(ctx *fiber.Ctx) error {
	dishId, err := ctx.ParamsInt("id", 0)
	if err != nil || dishId <= 0 {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid review ID")
	}

	if err = c.service.DeleteReview(ctx.UserContext(), int64(dishId)); err != nil {
		return err
	}
	return ctx.SendStatus(fiber.StatusNoContent)
}

func (c *EGControllerImpl) UpdateReview(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}
