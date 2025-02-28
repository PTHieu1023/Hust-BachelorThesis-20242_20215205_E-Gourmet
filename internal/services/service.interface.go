package services

import (
	"e-gourmet/core/internal/db"
	"e-gourmet/core/pkg/pagination"
)

type IProfileService interface {
	CreateProfile(params db.CreateProfileParams) (db.Profile, error)
	UpdateProfile(params db.UpdateProfileParams) (db.Profile, error)
	GetProfileById(id string) (db.Profile, error)
	GetListProfiles(filter *pagination.PageFilter) (pagination.Pagination[db.Profile], error)
	DeleteProfileById(id string) error
}
