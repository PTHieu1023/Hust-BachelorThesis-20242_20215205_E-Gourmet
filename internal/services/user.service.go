package services

import (
	"context"
	"database/sql"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/server/kc"
	"e-gourmet/core/internal/server/logger"
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"regexp"
	"strings"
)

func (s *Service) CreateUser(ctx context.Context, params *database.CreateUserParams) (*database.User, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "ERR_PARAMS_NIL")
	}
	if params.ID == nil || params.Username == nil || params.Email == nil || params.DisplayName == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "MISSING_REQUIRED_FIELDS (id, username, email, displayName)")
	}
	if err := validateEmail(*params.Email); err != nil {
		return nil, err
	}
	if *params.Username == *params.Email {
		*params.Username = usernameFromEmail(*params.Email)
	}
	if err := validateUsername(*params.Username); err != nil {
		return nil, err
	}

	kcUser := &gocloak.User{
		ID:            params.ID,
		Username:      params.Username,
		Enabled:       gocloak.BoolP(true),
		EmailVerified: gocloak.BoolP(true),
	}
	err := kc.Instance().UpdateUser(ctx, kcUser)
	if err != nil {
		return nil, err
	}

	user, err := s.querier.CreateUser(ctx, s.dbtx, params)
	var sqlErr *pgconn.PgError
	if err != nil && errors.As(err, &sqlErr) {
		switch sqlErr.Code {
		case "23505":
			return nil, fiber.NewError(fiber.StatusConflict, "SQL_CONSTRAIN_CONFLICT"+sqlErr.Detail)
		}
		return nil, fiber.NewError(fiber.StatusInternalServerError, "SQL_EXCEPTION "+sqlErr.Message)
	}

	return user, err
}

func (s *Service) GetUserById(ctx context.Context, id string) (*database.GetUserByIdRow, error) {
	if id == "" {
		return nil, fiber.NewError(fiber.StatusBadRequest, "MISSING_REQUIRED_FIELDS (id)")
	}

	user, err := s.querier.GetUserById(ctx, s.dbtx, id)
	if errors.As(err, &pgx.ErrNoRows) {
		return nil, fiber.NewError(fiber.StatusNotFound, "NOT_FOUND")
	}
	return user, err
}

func (s *Service) GetUserByUsername(ctx context.Context, username string) (*database.GetUserByUsernameRow, error) {
	if err := validateUsername(username); err != nil {
		return nil, err
	}
	user, err := s.querier.GetUserByUsername(ctx, s.dbtx, username)
	if errors.As(err, &pgx.ErrNoRows) {
		return nil, fiber.NewError(fiber.StatusNotFound, "NOT_FOUND")
	}
	return user, err
}

func (s *Service) UpdateUser(ctx context.Context, params *database.UpdateUserParams) (*database.UpdateUserRow, error) {
	if params == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "ERR_PARAMS_NIL")
	}
	if params.ID == nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "MISSING_REQUIRED_FIELDS (id)")
	}
	if params.Email != nil {
		if err := validateEmail(*params.Email); err != nil {
			return nil, err
		}
	}
	if params.Username != nil {
		if err := validateUsername(*params.Username); err != nil {
			return nil, err
		}
	}

	oldKC, _, err := updateKCUser(ctx, params)

	if err != nil {
		return nil, err
	}

	user, err := s.querier.UpdateUser(ctx, s.dbtx, params)

	if err != nil {
		logger.Instance().Info(fmt.Sprintf("Rollback user update due to error: %v", err))
		_ = kc.Instance().UpdateUser(ctx, oldKC)
	}

	if errors.As(err, &sql.ErrNoRows) {
		return nil, fiber.NewError(fiber.StatusNotFound, "NOT_FOUND user("+*params.ID+")")
	}
	return user, err
}

func validateEmail(email string) error {
	if len(email) > 127 {
		return fiber.NewError(fiber.StatusBadRequest, "INVALID_EMAIL_FORMAT")
	}
	emailRegex := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !emailRegex.MatchString(email) {
		return fiber.NewError(fiber.StatusBadRequest, "INVALID_EMAIL_FORMAT")
	}
	return nil
}

func validateUsername(username string) error {
	if len(username) > 64 {
		return fiber.NewError(fiber.StatusBadRequest, "INVALID_USERNAME_FORMAT")
	}
	usernameRegex := regexp.MustCompile(`^[a-zA-Z0-9.%+_@\-]{3,64}$`)

	if !usernameRegex.MatchString(username) {
		return fiber.NewError(fiber.StatusBadRequest, "INVALID_USERNAME_FORMAT")
	}
	return nil
}

func usernameFromEmail(email string) string {
	username := strings.SplitN(email, "@", 2)[0]
	// Convert to lowercase
	username = strings.ToLower(username)

	// Replace invalid characters (anything except a-z, 0-9, _) with "_"
	re := regexp.MustCompile(`[^a-z0-9_]+`)
	username = re.ReplaceAllString(username, "_")

	// Collapse multiple underscores
	username = regexp.MustCompile(`_+`).ReplaceAllString(username, "_")

	// Trim leading/trailing underscores
	username = strings.Trim(username, "_")

	// Truncate to MaxUsernameLength
	if len(username) > 64 {
		username = username[:64]
	}

	return username
}

func updateKCUser(ctx context.Context, params *database.UpdateUserParams) (oldKC *gocloak.User, newKC *gocloak.User, err error) {
	oldKC, err = kc.Instance().GetUserByID(ctx, *params.ID)
	if err != nil {
		return nil, nil, err
	}
	newKC = new(gocloak.User)
	*newKC = *oldKC

	if params.Username != nil {
		newKC.Username = params.Username
	}
	if params.Email != nil {
		newKC.Email = params.Email
	}
	if params.DisplayName != nil {
		newKC.FirstName = params.DisplayName
		newKC.LastName = new(string)
	}
	if params.AvatarUrl != nil {
		newKC.Attributes = new(map[string][]string)
		*newKC.Attributes = make(map[string][]string)
		(*newKC.Attributes)["avatar_url"] = []string{*params.AvatarUrl}
	}
	if params.Enable != nil {
		newKC.Enabled = params.Enable
	}

	err = kc.Instance().UpdateUser(ctx, newKC)
	return
}
