package routers

import (
	"e-gourmet/core/internal/handlers"
	"e-gourmet/core/internal/server"
)

func AssignProfileService() {
	assignHttpEndpoint()
}

func assignHttpEndpoint() {
	server.App().Group("/api/profile").
		Get("/", handlers.GetProfileList)
}
