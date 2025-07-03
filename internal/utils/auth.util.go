package utils

import "os"

type AuthConfig struct {
	issuerUrl    string
	realm        string
	clientId     string
	clientSecret string
}

var authConfig *AuthConfig = nil

func getAuthConfig() *AuthConfig {
	if authConfig == nil {
		authConfig = &AuthConfig{
			issuerUrl:    os.Getenv("EG_OAUTH_ISSUER_URL"),
			realm:        os.Getenv("EG_OAUTH_REALM"),
			clientId:     os.Getenv("EG_OAUTH_CLIENT_ID"),
			clientSecret: os.Getenv("EG_OAUTH_CLIENT_SECRET"),
		}
	}
	return authConfig
}

func AuthIssuerUrl() string {
	return getAuthConfig().issuerUrl
}
func AuthRealm() string {
	return getAuthConfig().realm
}
func AuthClientId() string {
	return getAuthConfig().clientId
}
func AuthClientSecret() string {
	return getAuthConfig().clientSecret
}

type AuthContextKey string

const (
	AuthUserID      AuthContextKey = "userID"
	AuthAccessToken AuthContextKey = "accessToken"
	AuthClaims      AuthContextKey = "claims"
	AuthIsAdmin     AuthContextKey = "isAdmin"
)
