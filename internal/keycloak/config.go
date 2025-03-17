package keycloak

import "time"

type Config struct {
	URL           string        `mapstructure:"url"`
	Realm         string        `mapstructure:"realm"`
	ClientID      string        `mapstructure:"client_id"`
	ClientSecret  string        `mapstructure:"client_secret"`
	Scope         string        `mapstructure:"scope"`
	AdminUser     string        `mapstructure:"admin_user"`
	AdminPass     string        `mapstructure:"admin_pass"`
	TimeThreshold time.Duration `mapstructure:"time_threshold"`
}

func DefaultConfig() *Config {
	return &Config{
		URL:           "http://localhost:8080/auth",
		Realm:         "default",
		ClientID:      "internal",
		ClientSecret:  "",
		Scope:         "profile, offline_access, openid",
		AdminUser:     "admin",
		AdminPass:     "admin",
		TimeThreshold: time.Millisecond * 500,
	}
}
