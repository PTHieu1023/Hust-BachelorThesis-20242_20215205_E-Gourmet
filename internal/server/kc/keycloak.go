package kc

import (
	"context"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"github.com/Nerzal/gocloak/v13"
	"go.uber.org/zap"
	"os"
	"sync"
	"time"
)

type Config struct {
	URL           string        `mapstructure:"url"`
	Realm         string        `mapstructure:"realm"`
	ClientID      string        `mapstructure:"client_id"`
	ClientSecret  string        `mapstructure:"client_secret"`
	Scope         string        `mapstructure:"scope"`
	AdminUser     string        `mapstructure:"session_user"`
	AdminPass     string        `mapstructure:"session_pass"`
	TimeThreshold time.Duration `mapstructure:"time_threshold"`
}

type Session struct {
	sync.Mutex
	IssuedAt time.Time
	*gocloak.JWT
}

type Keycloak struct {
	client  *gocloak.GoCloak
	config  *Config
	session *Session
}

const (
	DefaultConfigPath = "etc/config/keycloak.yml"
	ConfigPathEnv     = "EG_DATABASE_CONFIG"
	EnvPrefixConfig   = "EG_DATABASE"
	SessionClient     = "session-cli"
	SessionSecret     = "session-secret"
)

var _kc *Keycloak

func Instance() *Keycloak {
	if _kc == nil {
		logger.Instance().Info("Init Keycloak session")
		configPath := os.Getenv(ConfigPathEnv)
		if configPath == "" {
			configPath = DefaultConfigPath
		}
		config := configloader.LoadConfig[Config](configPath, EnvPrefixConfig)
		_kc = &Keycloak{
			client: gocloak.NewClient(config.URL),
			config: config,
			session: &Session{
				Mutex:    sync.Mutex{},
				IssuedAt: time.Now(),
				JWT:      nil,
			},
		}
	}

	return _kc
}

func (kc *Keycloak) GetSession(ctx context.Context) (accessToken string, err error) {
	if kc.session.JWT != nil && !isExpired(kc.session) {
		return kc.session.AccessToken, nil
	}

	kc.session.Lock()
	defer kc.session.Unlock()

	start := time.Now()
	if kc.session.JWT != nil && !isRefreshExpired(kc.session) {
		kc.session.JWT, err = kc.client.RefreshToken(ctx, kc.session.RefreshToken, SessionClient, SessionSecret, kc.config.Realm)
		if err == nil {
			kc.session.IssuedAt = start
		}
		logger.Instance().Info("Refresh keycloak session (Refresh mode)", zap.Duration("duration", time.Since(start)))
		return kc.session.AccessToken, err
	}

	kc.session.JWT, err = kc.client.LoginAdmin(ctx, kc.config.AdminUser, kc.config.AdminPass, kc.config.Realm)
	logger.Instance().Info("Refresh keycloak session (Create mode)", zap.Duration("duration", time.Since(start)))

	if err == nil {
		kc.session.IssuedAt = start
	}
	return kc.session.AccessToken, err
}

func (kc *Keycloak) CloseSession(ctx context.Context) {
	kc.session.Lock()
	defer kc.session.Unlock()
	if kc.session.JWT == nil || kc.session.RefreshToken == "" {
		return
	}

	err := kc.client.Logout(ctx, SessionClient, SessionSecret, kc.config.Realm, kc.session.RefreshToken)
	if err != nil {
		logger.Instance().Error("Failed to logout session session", zap.Error(err))
		return
	}
	kc.session.JWT = nil
}

func isExpired(session *Session) bool {
	return session.IssuedAt.Add(time.Duration(session.ExpiresIn) * time.Second).Before(time.Now())
}

func isRefreshExpired(session *Session) bool {
	return session.IssuedAt.Add(time.Duration(session.RefreshExpiresIn) * time.Second).Before(time.Now())
}
