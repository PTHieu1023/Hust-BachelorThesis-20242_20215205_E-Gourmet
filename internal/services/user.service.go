package services

import (
	"context"
	"database/sql"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/internal/utils"
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"regexp"
	"strings"
)

func (s *EGServiceImpl) CreateUser(ctx context.Context, params *database.CreateUserParams) (*database.User, error) {
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

	token := ctx.Value(utils.AuthAccessToken).(*jwt.Token).Raw
	realm := utils.AuthRealm()
	kcUser := gocloak.User{
		ID:            params.ID,
		Username:      params.Username,
		Enabled:       gocloak.BoolP(true),
		EmailVerified: gocloak.BoolP(true),
	}
	err := s.kc.UpdateUser(ctx, token, realm, kcUser)
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

func (s *EGServiceImpl) GetUserById(ctx context.Context, id string) (*database.GetUserByIdRow, error) {
	return s.querier.GetUserById(ctx, s.dbtx, id)
}

func (s *EGServiceImpl) GetUserByUsername(ctx context.Context, username string) (*database.GetUserByUsernameRow, error) {
	if err := validateUsername(username); err != nil {
		return nil, err
	}
	user, err := s.querier.GetUserByUsername(ctx, s.dbtx, username)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, fiber.NewError(fiber.StatusNotFound, "NOT_FOUND")
	}
	return user, err
}

func (s *EGServiceImpl) UpdateUser(ctx context.Context, params *database.UpdateUserParams) (*database.UpdateUserRow, error) {
	token := ctx.Value(utils.AuthAccessToken).(*jwt.Token).Raw
	realm := utils.AuthRealm()
	oldKC, _, err := s.updateKCUser(ctx, token, realm, params)
	if err != nil {
		return nil, err
	}

	user, err := s.querier.UpdateUser(ctx, s.dbtx, params)

	if err != nil {
		logger.Instance().Info(fmt.Sprintf("Rollback user update due to error: %v", err))
		_ = s.kc.UpdateUser(ctx, token, realm, *oldKC)
	}

	if errors.Is(err, sql.ErrNoRows) {
		return nil, fiber.NewError(fiber.StatusNotFound, "NOT_FOUND user("+*params.ID+")")
	}
	return user, err
}

func (s *EGServiceImpl) SyncUserWithKeycloak(ctx context.Context, claims *jwt.MapClaims) error {
	id := (*claims)["sub"].(string)
	existed, err := s.querier.GetUserById(ctx, s.dbtx, id)
	if err == nil && existed != nil {
		return nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return err
	}
	username := (*claims)["preferred_username"].(string)
	email := (*claims)["email"].(string)
	displayName := (*claims)["name"].(string)

	if err = validateEmail(email); err != nil {
		return err
	}
	if username == email {
		username = usernameFromEmail(email)
	}
	if err = validateUsername(username); err != nil {
		return err
	}

	params := &database.CreateUserParams{
		ID:          &id,
		Username:    &username,
		Email:       &email,
		DisplayName: &displayName,
	}
	_, err = s.querier.CreateUser(ctx, s.dbtx, params)
	return err
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

func (s *EGServiceImpl) updateKCUser(ctx context.Context, token string, realm string, params *database.UpdateUserParams) (oldKC *gocloak.User, newKC *gocloak.User, err error) {
	oldKC, err = s.kc.GetUserByID(ctx, token, realm, *params.ID)
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

	err = s.kc.UpdateUser(ctx, token, realm, *newKC)
	return
}
