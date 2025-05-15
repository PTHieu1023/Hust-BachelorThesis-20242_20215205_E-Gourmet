package server

import (
	"e-gourmet/core/internal/server/kc"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/pkg/configloader"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"go.uber.org/zap"
	"os"
	"strings"
	"time"
)

type CorsConfig struct {
	Enable       bool   `mapstructure:"enable"`
	AllowOrigins string `mapstructure:"allow-origins"`
	AllowMethods string `mapstructure:"allow-methods"`
	AllowHeaders string `mapstructure:"allow-headers"`
}

type StorageConfig struct {
	ResourcePath string `mapstructure:"resource-path"`
	URLPrefix    string `mapstructure:"url-prefix"`
}

type Config struct {
	Cors    CorsConfig    `mapstructure:"cors"`
	Storage StorageConfig `mapstructure:"storage"`
}

type Middlewares struct {
	Logger   fiber.Handler
	Recover  fiber.Handler
	Cors     fiber.Handler
	Compress fiber.Handler
	Auth     fiber.Handler
}

const (
	DefaultConfigPath = "etc/config/middleware.yml"
	ConfigPathEnv     = "EG_MIDDLEWARE_CONFIG"
	EnvPrefixConfig   = "EG_MIDDLEWARE"
)

func InitMiddlewares() *Middlewares {
	configPath := os.Getenv(ConfigPathEnv)
	if configPath == "" {
		configPath = DefaultConfigPath
	}
	config := configloader.LoadConfig[Config](configPath, EnvPrefixConfig)

	return &Middlewares{
		Recover: recover.New(),
		Cors: cors.New(cors.Config{
			AllowOrigins: config.Cors.AllowOrigins,
			AllowMethods: config.Cors.AllowMethods,
			AllowHeaders: config.Cors.AllowHeaders,
		}),
		Compress: compress.New(compress.Config{
			Level: compress.LevelBestSpeed,
		}),
		Auth:   useAuth(),
		Logger: useLogging(),
	}
}

func useAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			authHeader = "Bearer " + c.Query("token")
		}
		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")

		if tokenStr == "" {
			return fiber.NewError(fiber.StatusUnauthorized, "Missing or invalid Authorization header")
		}

		introspect, err := kc.Instance().RetrospectToken(c.Context(), tokenStr)
		if err != nil || introspect == nil || !*introspect.Active {
			return fiber.NewError(fiber.StatusUnauthorized, "Invalid token")
		}

		token, claims, err := kc.Instance().DecodeAccessToken(c.Context(), tokenStr)
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

func useLogging() fiber.Handler {
	return func(c *fiber.Ctx) error {
		c.Locals("startTime", time.Now())

		if err := c.Next(); err != nil {
			return err
		}

		fields := []zap.Field{
			zap.String("method", c.Method()),
			zap.String("ip", c.IP()),
			zap.Int("status", c.Response().StatusCode()),
			zap.String("latency", time.Since(c.Locals("startTime").(time.Time)).String()),
			zap.String("url", c.OriginalURL()),
		}

		logger.Instance().Info("Request", fields...)
		return nil
	}
}
