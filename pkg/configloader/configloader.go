package configloader

import (
	"github.com/spf13/viper"
	"strings"
)

func LoadConfig[T any](defaultConfig *T, customConfigFile string, envPrefix string) *T {
	v := viper.New()
	if customConfigFile != "" {
		v.SetConfigFile(customConfigFile)
		if err := v.ReadInConfig(); err != nil {
			panic(err)
		}
	}

	v.AutomaticEnv()
	v.SetEnvPrefix(envPrefix)
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	if err := v.Unmarshal(&defaultConfig); err != nil {
		panic(err)
	}
	return defaultConfig
}
