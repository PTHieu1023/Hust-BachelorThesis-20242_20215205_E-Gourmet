package kafka

type Config struct {
	Brokers  string          `mapstructure:"brokers"`
	Producer *ProducerConfig `mapstructure:"producer"`
}

type ProducerConfig struct {
	Async                  bool `mapstructure:"async"`
	RequiredAcks           int  `mapstructure:"required-acks"`
	AllowAutoTopicCreation bool `mapstructure:"allow-auto-topic-creation"`
}

func DefaultConfig() *Config {
	return &Config{
		Brokers: "localhost:9092",
		Producer: &ProducerConfig{
			Async:                  false,
			RequiredAcks:           0,
			AllowAutoTopicCreation: false,
		},
	}
}
