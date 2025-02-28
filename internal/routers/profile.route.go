package routers

import (
	"e-gourmet/core/internal/server/fiber"
)

func AssignProfileService() {
	assignHttpEndpoint()
}

func assignHttpEndpoint() {
	fiber.App().Group("/api/profile").
		Get("/", Controllers().ProfileControllerV1.GetProfiles)
}
