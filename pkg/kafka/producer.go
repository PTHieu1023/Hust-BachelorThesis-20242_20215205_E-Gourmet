package kafka

import (
	"context"
	"fmt"
	"github.com/segmentio/kafka-go"
	"go.uber.org/zap"
	"sync"
	"time"
)

type IProducer interface {
	Produce(ctx context.Context, topic string, msg interface{}) error
	Close()
}

type Producer struct {
	writers *kafka.Writer
	mu      sync.Mutex
	logger  *zap.Logger
}

func NewProducer(brokers []string, logger *zap.Logger) IProducer {
	return &Producer{
		writers: &kafka.Writer{
			Addr:                   kafka.TCP(brokers...),
			Balancer:               &kafka.LeastBytes{},
			RequiredAcks:           kafka.RequireOne,
			Async:                  false,
			AllowAutoTopicCreation: true,
		},
		mu:     sync.Mutex{},
		logger: logger,
	}
}

func (p *Producer) Produce(ctx context.Context, topic string, msg interface{}) error {
	start := time.Now()
	kafkaMsg := kafka.Message{
		Topic: topic,
		Key:   []byte(topic),
		Value: []byte(fmt.Sprintf("%v", msg)),
	}
	err := p.writers.WriteMessages(ctx, kafkaMsg)
	p.logger.Info(fmt.Sprintf("KAFKA PRODUCER WRITE TOPIC: %s -> %s\n", topic, time.Since(start)))
	return err
}

func (p *Producer) Close() {
	_ = p.writers.Close()
}
