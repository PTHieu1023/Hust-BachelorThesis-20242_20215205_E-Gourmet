package middlewares

import (
	"context"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
	"os"
	"strings"
)

type ContextKey string

const (
	CtxUserID         ContextKey = "userID"
	CtxAccessToken    ContextKey = "accessToken"
	CtxClaims         ContextKey = "claims"
	CtxKCRealm        ContextKey = "kcRealm"
	CtxKCClientID     ContextKey = "kcClientID"
	CtxKCClientSecret ContextKey = "kcClientSecret"
)

func UseAuth(kc *gocloak.GoCloak) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return unauthorized("Missing or invalid Authorization header")
		}

		tokenStr := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if tokenStr == "" {
			return unauthorized("Missing or invalid Authorization header")
		}

		clientId := os.Getenv("EG_KC_CLIENT_ID")
		clientSecret := os.Getenv("EG_KC_CLIENT_SECRET")
		realm := os.Getenv("EG_KC_REALM")

		introspect, err := kc.RetrospectToken(c.UserContext(), tokenStr, clientId, clientSecret, realm)
		if err != nil || introspect == nil || !*introspect.Active {
			return unauthorized("Invalid or expired token")
		}

		token, claims, err := kc.DecodeAccessToken(c.Context(), tokenStr, realm)
		if err != nil || token == nil || !token.Valid {
			return unauthorized("Invalid token")
		}

		userID, ok := (*claims)["sub"].(string)
		if !ok || userID == "" {
			return unauthorized("Invalid user in token")
		}

		ctx := context.WithValue(c.UserContext(), CtxUserID, userID)
		ctx = context.WithValue(ctx, CtxAccessToken, token)
		ctx = context.WithValue(ctx, CtxClaims, claims)
		ctx = context.WithValue(ctx, CtxKCRealm, realm)
		ctx = context.WithValue(ctx, CtxKCClientID, clientId)
		ctx = context.WithValue(ctx, CtxKCClientSecret, clientSecret)
		c.SetUserContext(ctx)

		return c.Next()
	}
}

func unauthorized(msg string) error {
	return fiber.NewError(fiber.StatusUnauthorized, msg)
}
