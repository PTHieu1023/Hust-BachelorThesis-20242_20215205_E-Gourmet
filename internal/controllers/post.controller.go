package controllers

import (
	"database/sql"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/utils"
	"e-gourmet/core/pkg/pagination"
	"errors"
	"github.com/gofiber/fiber/v2"
)

func (c *Controller) GetPosts(ctx *fiber.Ctx) error {
	params := new(database.GetPostsParams)
	if err := ctx.QueryParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid request body")
	}
	pageFilter, err := pagination.GetPageFilter(ctx)
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid pagination parameters")
	}
	params.Limit = int32(pageFilter.Size)
	params.Offset = int32((pageFilter.Page - 1) * pageFilter.Size)

	posts, err := c.service.GetPosts(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.JSON(posts)
}

func (c *Controller) GetPostById(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	post, err := c.service.GetPostById(ctx.UserContext(), int64(id))
	if errors.Is(err, sql.ErrNoRows) {
		return fiber.NewError(fiber.StatusNotFound, "Post not found.")
	}

	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": post})
}

func (c *Controller) CreatePost(ctx *fiber.Ctx) error {
	params := new(database.CreatePostParams)
	if err := ctx.BodyParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	// Check if user is restaurant owner/manager
	userID := ctx.Locals(utils.AuthUserID).(string)
	if userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	post, err := c.service.CreatePost(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"data": post})
}

func (c *Controller) UpdatePost(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	params := new(database.UpdatePostParams)
	if err := ctx.BodyParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	params.PostID = int32(id)

	post, err := c.service.UpdatePost(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": post})
}

func (c *Controller) DeletePost(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	err = c.service.DeletePost(ctx.UserContext(), int64(id))
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusNoContent).Send(nil)
}

func (c *Controller) LikePost(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	userID := ctx.Locals(utils.AuthUserID).(string)
	if userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	err = c.service.LikePost(ctx.UserContext(), &database.LikePostParams{
		PostID: int64(id),
		UserID: userID,
	})
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post liked"})
}

func (c *Controller) UnlikePost(ctx *fiber.Ctx) error {
	id, err := ctx.ParamsInt("id")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid post ID.")
	}

	userID := ctx.Locals(utils.AuthUserID).(string)
	if userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	err = c.service.UnlikePost(ctx.UserContext(), &database.UnlikePostParams{
		PostID: int64(id),
		UserID: userID,
	})
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Post unliked"})
}

func (c *Controller) CreateComment(ctx *fiber.Ctx) error {
	postId, err := ctx.ParamsInt("postId")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	params := new(database.CreateCommentParams)
	if err := ctx.BodyParser(params); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	userID := ctx.Locals(utils.AuthUserID).(string)
	if userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	params.PostID = int64(postId)
	params.UserID = userID

	comment, err := c.service.CreateComment(ctx.UserContext(), params)
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{"data": comment})
}

func (c *Controller) GetCommentsByPost(ctx *fiber.Ctx) error {
	postId, err := ctx.ParamsInt("postId")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, errInvalidID)
	}

	comments, err := c.service.GetCommentsByPost(ctx.UserContext(), int64(postId))
	if err != nil {
		return err
	}

	return ctx.JSON(fiber.Map{"data": comments})
}

func (c *Controller) DeleteComment(ctx *fiber.Ctx) error {
	commentId, err := ctx.ParamsInt("commentId")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "Invalid comment ID.")
	}

	userID := ctx.Locals(utils.AuthUserID).(string)
	if userID == "" {
		return fiber.NewError(fiber.StatusUnauthorized, "Unauthorized")
	}

	err = c.service.DeleteComment(ctx.UserContext(), &database.DeleteCommentParams{
		ID:     int32(commentId),
		UserID: userID,
	})
	if err != nil {
		return err
	}

	return ctx.Status(fiber.StatusNoContent).Send(nil)
}
