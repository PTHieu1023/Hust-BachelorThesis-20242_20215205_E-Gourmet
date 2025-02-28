package controllers

import (
	"e-gourmet/core/internal/services"
	"e-gourmet/core/pkg/pagination"
	"github.com/gofiber/fiber/v2"
)

type ProfileControllerV1 struct {
	profileService services.IProfileService
}

func NewProfileControllerV1(profileService services.IProfileService) IProfileController {
	return &ProfileControllerV1{
		profileService: profileService,
	}
}

func (pc *ProfileControllerV1) CreateProfile(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (pc *ProfileControllerV1) GetProfile(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (pc *ProfileControllerV1) GetProfiles(ctx *fiber.Ctx) error {
	profiles, err := pc.profileService.GetListProfiles(&pagination.PageFilter{
		Page:    0,
		Size:    0,
		OrderBy: nil,
	})
	if err != nil {
		return err
	}
	return ctx.JSON(profiles)
}

func (pc *ProfileControllerV1) UpdateProfile(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}

func (pc *ProfileControllerV1) DeleteProfile(ctx *fiber.Ctx) error {
	//TODO implement me
	panic("implement me")
}
