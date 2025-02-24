package storage

type StorageConfig struct {
	ResourcePath string `mapstructure:"resource-path"`
	URLPrefix    string `mapstructure:"url-prefix"`
}
