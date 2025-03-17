package services

import (
	"e-gourmet/core/internal/database"
	"e-gourmet/core/pkg/pagination"
)

type IProfileService interface {
	CreateProfile(params database.CreateProfileParams) (database.Profile, error)
	UpdateProfile(params database.UpdateProfileParams) (database.Profile, error)
	GetProfileById(id string) (database.Profile, error)
	GetListProfiles(filter *pagination.PageFilter) (pagination.Pagination[database.Profile], error)
	DeleteProfileById(id string) error
}
