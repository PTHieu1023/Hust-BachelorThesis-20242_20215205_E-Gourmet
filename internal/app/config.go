package app

type Config struct {
	Name          string `mapstructure:"name"`
	Port          int    `mapstructure:"port"`
	Header        string `mapstructure:"header"`
	Prefork       bool   `mapstructure:"prefork"`
	CaseSensitive bool   `mapstructure:"case-sensitive"`
	Immutable     bool   `mapstructure:"immutable"`
}

func DefaultConfig() *Config {
	return &Config{
		Name:          "Fiber",
		Port:          8080,
		Header:        "go-app",
		Prefork:       false,
		CaseSensitive: false,
		Immutable:     false,
	}
}
