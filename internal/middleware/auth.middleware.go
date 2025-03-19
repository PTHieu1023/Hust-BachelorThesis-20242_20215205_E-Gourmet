package middleware

import (
	"e-gourmet/core/pkg/keycloak"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"strings"
)

func AuthMiddleware(client keycloak.IKeycloak, logger *zap.Logger) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing or invalid Authorization header")
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

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
		admtk, err := client.GetAdminToken(c.Context())
		_, hihi, err := client.DecodeAccessToken(c.Context(), admtk)
		if err != nil {
			logger.Error(err.Error())
		} else {
			fmt.Println(hihi)
		}

		return c.Next()
	}
}
