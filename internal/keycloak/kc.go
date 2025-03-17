package keycloak

import (
	"context"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/golang-jwt/jwt/v5"
	"go.uber.org/zap"
	"sync"
	"time"
)

type IKeycloak interface {
	CloseSession(ctx context.Context)
	// GetAdminToken get access token of system admin user
	GetAdminToken(ctx context.Context) (string, error)
	// DecodeAccessToken decodes the accessToken
	DecodeAccessToken(ctx context.Context, accessToken string) (*jwt.Token, *jwt.MapClaims, error)
	// RetrospectToken DecodeAccessTokenCustomClaims calls the token introspection endpoint
	RetrospectToken(ctx context.Context, accessToken string) (*gocloak.IntroSpectTokenResult, error)
	//SetPassword sets a new password for the user with the given id. Needs elevated privileges
	SetPassword(ctx context.Context, userID string, password string, temporary bool) error
	// CreateUser creates a new user
	CreateUser(ctx context.Context, user *gocloak.User) (string, error)
	// UpdateUser updates the given user
	UpdateUser(ctx context.Context, user *gocloak.User) error
	// DeleteUser deletes the given user
	DeleteUser(ctx context.Context, userID string) error
	// GetUserByID gets the user with the given id
	GetUserByID(ctx context.Context, userID string) (*gocloak.User, error)
}

type Keycloak struct {
	client *gocloak.GoCloak
	logger *zap.Logger
	config *Config
	admin  *AdminToken
}

func New(config *Config, logger *zap.Logger) *Keycloak {
	return &Keycloak{
		client: gocloak.NewClient(config.URL),
		logger: logger,
		config: config,
		admin: &AdminToken{
			Mutex:    sync.Mutex{},
			IssuedAt: time.Now(),
			JWT:      nil,
		},
	}
}

// CloseSession terminates the current admin session
func (kc *Keycloak) CloseSession(ctx context.Context) {
	kc.admin.Lock()
	defer kc.admin.Unlock()
	if kc.admin.JWT == nil || kc.admin.RefreshToken == "" {
		return
	}

	start := time.Now()
	err := kc.client.Logout(ctx, "admin-cli", "", kc.config.Realm, kc.admin.RefreshToken)
	if err != nil {
		kc.logger.Error("Failed to logout admin session", zap.Error(err))
		return
	}
	kc.logger.Info("Logout admin session", zap.Duration("duration", time.Since(start)))
	kc.admin.JWT = nil
	kc.logExecute("Logout admin session", start)
}

func (kc *Keycloak) GetAdminToken(ctx context.Context) (accessToken string, err error) {
	if kc.admin.JWT != nil && !kc.admin.isExpired() {
		return kc.admin.AccessToken, nil
	}
	kc.admin.Lock() // Prevent multi-access when token is refreshing or initializing
	defer kc.admin.Unlock()
	start := time.Now()
	if kc.admin.JWT != nil && !kc.admin.isRefreshExpired() {
		kc.admin.JWT, err = kc.client.RefreshToken(ctx, kc.admin.RefreshToken, "admin-cli", "", kc.config.Realm)
		if err == nil {
			kc.admin.IssuedAt = start
		}
		kc.logExecute("Refresh kc.admin session", start)
		return kc.admin.AccessToken, err
	}
	kc.admin.JWT, err = kc.client.LoginAdmin(ctx, kc.config.AdminUser, kc.config.AdminPass, kc.config.Realm)
	if err == nil {
		kc.admin.IssuedAt = start
	}
	kc.logExecute("Login admin session", start)
	return kc.admin.AccessToken, err
}

func (kc *Keycloak) DecodeAccessToken(ctx context.Context, accessToken string) (token *jwt.Token, claims *jwt.MapClaims, err error) {
	start := time.Now()
	token, claims, err = kc.client.DecodeAccessToken(ctx, accessToken, kc.config.Realm)
	kc.logExecute("Decode access token", start)
	return token, claims, err
}

func (kc *Keycloak) RetrospectToken(ctx context.Context, accessToken string) (introspectResult *gocloak.IntroSpectTokenResult, err error) {
	start := time.Now()
	introspectResult, err = kc.client.RetrospectToken(ctx, accessToken, kc.config.ClientID, kc.config.ClientSecret, kc.config.Realm)
	kc.logExecute("Retrospect token", start)
	return introspectResult, err
}

func (kc *Keycloak) SetPassword(ctx context.Context, userID string, password string, temporary bool) error {
	token, err := kc.GetAdminToken(ctx)
	if err != nil {
		return err
	}
	start := time.Now()
	err = kc.client.SetPassword(ctx, token, userID, kc.config.Realm, password, temporary)
	kc.logExecute("Set password", start)
	return err
}

func (kc *Keycloak) CreateUser(ctx context.Context, user *gocloak.User) (string, error) {
	token, err := kc.GetAdminToken(ctx)
	if err != nil {
		return "", err
	}
	start := time.Now()
	userId, err := kc.client.CreateUser(ctx, token, kc.config.Realm, *user)
	kc.logExecute("Create user", start)
	return userId, err
}

func (kc *Keycloak) UpdateUser(ctx context.Context, user *gocloak.User) error {
	token, err := kc.GetAdminToken(ctx)
	if err != nil {
		return err
	}
	start := time.Now()
	err = kc.client.UpdateUser(ctx, token, kc.config.Realm, *user)
	kc.logExecute("Update user", start)
	return err
}

func (kc *Keycloak) DeleteUser(ctx context.Context, userID string) error {
	token, err := kc.GetAdminToken(ctx)
	if err != nil {
		return err
	}
	start := time.Now()
	err = kc.client.DeleteUser(ctx, token, kc.config.Realm, userID)
	kc.logExecute("Delete user", start)
	return err
}

func (kc *Keycloak) GetUserByID(ctx context.Context, userID string) (*gocloak.User, error) {
	token, err := kc.GetAdminToken(ctx)
	if err != nil {
		return nil, err
	}
	start := time.Now()
	user, err := kc.client.GetUserByID(ctx, token, kc.config.Realm, userID)
	kc.logExecute("Get user", start)
	return user, err
}

func (kc *Keycloak) logExecute(operation string, start time.Time) {
	duration := time.Since(start)
	kc.logger.Info(fmt.Sprintf("KEYCLOAK CLIENT: %s -> %s", operation, duration))
	if duration > kc.config.TimeThreshold {
		kc.logger.Warn("KEYCLOAK REQUEST EXCEEDED TIME THRESHOLD", zap.String("operation", operation), zap.String("duration", duration.String()))
	}
}
