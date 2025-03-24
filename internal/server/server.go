package server

import (
	"context"
	"e-gourmet/core/internal/app"
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/database"
	"e-gourmet/core/internal/middleware"
	"e-gourmet/core/internal/routers"
	"e-gourmet/core/internal/services"
	"e-gourmet/core/internal/websocket"
	"e-gourmet/core/pkg/kafka"
	"e-gourmet/core/pkg/keycloak"
	"e-gourmet/core/pkg/logger"
	"e-gourmet/core/pkg/rediscluster"
	"github.com/gofiber/fiber/v2"
	"go.uber.org/zap"
	"strings"

	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

type ServiceSet struct {
	ProfileV1 services.IProfileService
}

type ControllerSet struct {
	ProfileV1 controllers.IProfileController
}

type Server struct {
	port        int
	logger      *zap.Logger
	db          database.IDatabase
	redis       rediscluster.IRedis
	keycloak    keycloak.IKeycloak
	app         *fiber.App
	middlewares *middleware.Middlewares
	querier     database.Querier
	socket      *websocket.Server
	services    *ServiceSet
	controllers *ControllerSet
	routers     []routers.IRouter
}

func InitServer() *Server {
	config := InitConfig()
	server := &Server{}
	server.port = config.App.Port
	server.logger = logger.New(config.Logger)
	server.socket = websocket.New(server.logger)
	server.querier = database.New()
	server.db = database.NewDBClient(config.Database, server.logger)
	server.redis = rediscluster.New(config.Redis, server.logger)
	server.keycloak = keycloak.New(config.Keycloak, server.logger)
	server.middlewares = middleware.New(config.Middleware, server.keycloak, server.logger)
	server.app = app.NewFiberApp(config.App, server.logger)
	server.services = &ServiceSet{
		ProfileV1: services.NewProfileServiceV1(server.db, server.querier),
	}

	server.controllers = &ControllerSet{
		ProfileV1: controllers.NewProfileControllerV1(server.services.ProfileV1),
	}
	producer := kafka.NewProducer(strings.Split(config.Kafka.Brokers, ","), server.logger)
	for i := 0; i < 10; i++ {
		err := producer.Produce(context.Background(), fmt.Sprintf("test%d", i%3+3), i)
		if err != nil {
			server.logger.Error(fmt.Sprintf("producer error: %v", err))
		}
	}
	server.routers = append(server.routers, routers.NewProfileRouter(server.controllers.ProfileV1))
	return server
}

func (s *Server) start() {
	if err := s.app.Listen(fmt.Sprintf(":%d", s.port)); err != nil {
		s.logger.Error("Failed to start Config", zap.Error(err))
	}
}

func (s *Server) clean(ctx context.Context) {
	s.db.Close()
	s.redis.Close()
	s.keycloak.CloseSession(ctx)
}

func (s *Server) shutdown(isRunning chan bool) {
	if s.app == nil {
		s.logger.Fatal("App not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	s.logger.Info("Gracefully shutting down the server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := s.app.ShutdownWithContext(ctx); err != nil {
		s.logger.Error("Error during server shutdown", zap.Error(err))
	}

	s.logger.Info("Running cleanup tasks...")
	s.clean(ctx)

	s.logger.Info("Server shutdown complete.")

	isRunning <- false
}

func Boostrap() {
	isRunning := make(chan bool, 1)
	s := InitServer()

	middlewares := s.middlewares
	s.app.Use(middlewares.Logger)
	s.app.Use(middlewares.Recover)
	s.app.Use(middlewares.Cors)
	s.app.Use(middlewares.Compress)
	s.app.Use(middlewares.Auth)
	s.app.Use("/ws", websocket.EnableWebsocket())
	s.app.Get("/ws", s.socket.ServeHTTP())

	for _, router := range s.routers {
		router.AssignAPI(s.app)
	}

	s.logger.Info("Completed setting up Config!")
	go s.start()
	go s.shutdown(isRunning)
	<-isRunning
}
