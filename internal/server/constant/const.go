package constant

const (
	DefaultConfigFiberPath      = "etc/config/fiber.yml"
	DefaultConfigDbPath         = "etc/config/db.yml"
	DefaultConfigLoggerPath     = "etc/config/logger.yml"
	DefaultConfigMiddlewarePath = "etc/config/middleware.yml"

	CustomConfigFiberPathEnv      = "EG_FIBER_CONFIG_PATH"
	CustomConfigDbPathEnv         = "EG_DB_CONFIG_PATH"
	CustomConfigLoggerPathEnv     = "EG_LOGGER_CONFIG_PATH"
	CustomConfigMiddlewarePathEnv = "EG_MIDDLEWARE_CONFIG_PATH"

	EnvPrefixConfigFiber      = "EG_FIBER"
	EnvPrefixConfigDB         = "EG_DB"
	EnvPrefixConfigLogger     = "EG_LOGGER"
	EnvPrefixConfigMiddleware = "EG_MIDDLEWARE"
)
