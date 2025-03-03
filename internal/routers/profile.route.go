package routers

import (
	"e-gourmet/core/internal/controllers"
	"github.com/gofiber/fiber/v2"
)

type ProfileRouter struct {
	profileCtrlV1 controllers.IProfileController
}

func NewProfileRouter(profileCtrlV1 controllers.IProfileController) *ProfileRouter {
	return &ProfileRouter{
		profileCtrlV1: profileCtrlV1,
	}
}

func (pr ProfileRouter) AssignAPI(app *fiber.App) {
	pr.AssignRest(app)
}

func (pr ProfileRouter) AssignRest(app *fiber.App) {
	app.Group("/api/v1/profile").
		Get("/", pr.profileCtrlV1.GetProfiles)
}
