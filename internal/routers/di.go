package routers

import "github.com/gofiber/fiber/v2"

type IRouter interface {
	AssignRest(app *fiber.App)
	AssignAPI(app *fiber.App)
}
