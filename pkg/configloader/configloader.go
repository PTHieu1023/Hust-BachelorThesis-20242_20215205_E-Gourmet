package configloader

import (
	"github.com/spf13/viper"
	"strings"
)

func LoadConfig[T any](defaultConfigFile string, customConfigFile string, envPrefix string) *T {
	v := viper.New()
	v.SetConfigFile(defaultConfigFile)

	if err := v.ReadInConfig(); err != nil {
		panic(err)
	}

	v.SetConfigFile(customConfigFile)

	if err := v.MergeInConfig(); err != nil {
		panic(err)
	}

	v.AutomaticEnv()
	v.SetEnvPrefix(envPrefix)
	v.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))
	var conf T
	if err := v.Unmarshal(&conf); err != nil {
		panic(err)
	}

	return &conf
}
