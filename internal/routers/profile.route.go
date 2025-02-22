package routers

import (
	"e-gourmet/core/internal/handlers"
	"e-gourmet/core/internal/server/fiber"
)

func AssignProfileService() {
	assignHttpEndpoint()
}

func assignHttpEndpoint() {
	fiber.App().Group("/api/profile").
		Get("/", handlers.GetProfileList)
}
