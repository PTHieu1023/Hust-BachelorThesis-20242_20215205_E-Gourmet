package middlewares

import (
	"context"
	"e-gourmet/core/internal/server/kc"
	"github.com/gofiber/fiber/v2"
	"strings"
)

type ContextKey string

const (
	CtxUserID      ContextKey = "userID"
	CtxAccessToken ContextKey = "accessToken"
	CtxClaims      ContextKey = "claims"
)

func UseAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return unauthorized("Missing or invalid Authorization header")
		}

		tokenStr := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if tokenStr == "" {
			return unauthorized("Missing or invalid Authorization header")
		}

		keycloak := kc.Instance()

		introspect, err := keycloak.RetrospectToken(c.Context(), tokenStr)
		if err != nil || introspect == nil || !*introspect.Active {
			return unauthorized("Invalid or expired token")
		}

		token, claims, err := keycloak.DecodeAccessToken(c.Context(), tokenStr)
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
		c.SetUserContext(ctx)

		return c.Next()
	}
}

func unauthorized(msg string) error {
	return fiber.NewError(fiber.StatusUnauthorized, msg)
}
