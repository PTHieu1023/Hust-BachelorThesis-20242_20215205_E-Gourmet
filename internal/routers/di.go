package routers

import (
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/services"
)

type ControllerSet struct {
	ProfileControllerV1 controllers.IProfileController
}

var _controllers *ControllerSet

func Controllers() *ControllerSet {
	if _controllers == nil {
		_controllers = injectDependencies()
	}
	return _controllers
}

func injectDependencies() *ControllerSet {
	// Auto generated db
	var queries *db.Queries = db.New()

	// API V1 Services
	var profileServiceV1 services.IProfileService = services.NewProfileServiceV1(queries)

	// API V1 Controller
	var profileControllerV1 controllers.IProfileController = controllers.NewProfileControllerV1(profileServiceV1)

	return &ControllerSet{
		ProfileControllerV1: profileControllerV1,
	}
}
