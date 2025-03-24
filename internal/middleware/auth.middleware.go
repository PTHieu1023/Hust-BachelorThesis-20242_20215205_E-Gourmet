package middleware

import (
	"e-gourmet/core/pkg/keycloak"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"strings"
)

func AuthMiddleware(client keycloak.IKeycloak, logger *zap.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			authHeader = "Bearer " + c.Query("token")
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		if tokenStr == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing or invalid Authorization header")
		}

		introspect, err := client.RetrospectToken(c.Context(), tokenStr)
		if err != nil || introspect == nil || !*introspect.Active {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}

		token, claims, err := client.DecodeAccessToken(c.Context(), tokenStr)
		if err != nil || token == nil || !token.Valid {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}

		userID, ok := (*claims)["sub"].(string)
		username, ok := (*claims)["preferred_username"].(string)
		if !ok || userID == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Token missing sub claim")
		}

		c.Locals("userID", userID)
		c.Locals("username", username)

		return c.Next()
	}
}
