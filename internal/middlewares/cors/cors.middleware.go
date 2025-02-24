package cors

type CorsConfig struct {
	Enable       bool   `mapstructure:"enable"`
	AllowOrigins string `mapstructure:"allow-origins"`
	AllowMethods string `mapstructure:"allow-methods"`
	AllowHeaders string `mapstructure:"allow-headers"`
}
