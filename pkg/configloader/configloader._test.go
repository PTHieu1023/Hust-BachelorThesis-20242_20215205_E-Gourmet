package configloader

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Sample server struct for testing
type TestConfig struct {
	Server struct {
		Port int    `mapstructure:"port"`
		Host string `mapstructure:"host"`
	} `mapstructure:"server"`
	Database struct {
		User string `mapstructure:"user"`
		Pass string `mapstructure:"pass"`
	} `mapstructure:"database"`
}

func createTempConfig(content string) (string, error) {
	tmpFile, err := os.CreateTemp("", "server-*.yml")
	if err != nil {
		return "", err
	}
	defer tmpFile.Close()

	_, err = tmpFile.Write([]byte(content))
	return tmpFile.Name(), err
}

func TestLoadConfig(t *testing.T) {
	// Create a default server file
	defaultConfigContent := `
server:
  port: 8080
  host: "localhost"
database:
  user: "default_user"
  pass: "default_pass"
`
	defaultConfigPath, err := createTempConfig(defaultConfigContent)
	require.NoError(t, err)
	defer os.Remove(defaultConfigPath)

	// Create a custom server file that overrides some values
	customConfigContent := `
server:
  port: 9090
database:
  user: "custom_user"
`
	customConfigPath, err := createTempConfig(customConfigContent)
	require.NoError(t, err)
	defer os.Remove(customConfigPath)

	// Set environment variables to override server values
	_ = os.Setenv("EG_SERVER_HOST", "env_host")
	_ = os.Setenv("EG_DATABASE_PASS", "env_pass")
	defer func() {
		_ = os.Unsetenv("EG_SERVER_HOST")
	}()
	defer func() {
		_ = os.Unsetenv("EG_DATABASE_PASS")
	}()

	// Load server using LoadConfig function
	config := LoadConfig[TestConfig](defaultConfigPath, customConfigPath, "EG")

	// Verify merged server
	assert.Equal(t, 9090, config.Server.Port)            // Custom server overrides default
	assert.Equal(t, "env_host", config.Server.Host)      // Environment overrides custom server
	assert.Equal(t, "custom_user", config.Database.User) // Custom server overrides default
	assert.Equal(t, "env_pass", config.Database.Pass)    // Environment overrides custom server
}
