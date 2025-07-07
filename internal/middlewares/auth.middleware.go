package middlewares

import (
	"context"
	"e-gourmet/core/internal/services"
	"e-gourmet/core/internal/utils"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"slices"
	"strings"
)

type ContextKey string

func UseAuth(kc *gocloak.GoCloak, service services.EGService) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing or invalid Authorization header")
		}

		tokenStr := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if tokenStr == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing or invalid Authorization header")
		}

		introspect, err := kc.RetrospectToken(
			c.UserContext(),
			tokenStr,
			utils.AuthClientId(),
			utils.AuthClientSecret(),
			utils.AuthRealm())

		if err != nil || introspect == nil || !*introspect.Active {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid or expired token")
		}

		token, claims, err := kc.DecodeAccessToken(c.Context(), tokenStr, utils.AuthRealm())
		if err != nil || token == nil || !token.Valid {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}

		userID, ok := (*claims)["sub"].(string)
		if !ok || userID == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid user in token")
		}

		ctx := context.WithValue(c.UserContext(), utils.AuthUserID, userID)
		ctx = context.WithValue(ctx, utils.AuthAccessToken, token)
		ctx = context.WithValue(ctx, utils.AuthClaims, claims)
		ctx = context.WithValue(ctx, utils.AuthIsAdmin, isAdmin(claims))
		if service.SyncUserWithKeycloak(ctx, claims) != nil {
			return fiber.NewError(fiber.StatusUnauthorized, "Failed to sync user with Keycloak")
		}
		c.SetUserContext(ctx)

		return c.Next()
	}
}

func isAdmin(claims *jwt.MapClaims) bool {
	resourceAccess, ok := (*claims)["resource_access"].(map[string]interface{})
	if !ok {
		return false
	}

	clientAccess, ok := resourceAccess[utils.AuthClientId()].(map[string]interface{})
	if !ok {
		return false
	}

	clientRoles, ok := clientAccess["roles"].([]string)
	if !ok {
		return false
	}

	return slices.Contains(clientRoles, "admin")
}
