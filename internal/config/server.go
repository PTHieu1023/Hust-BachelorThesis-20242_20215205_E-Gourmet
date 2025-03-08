package config

import (
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/db"
	"e-gourmet/core/internal/routers"
	"e-gourmet/core/internal/services"
	"e-gourmet/core/pkg/rediscluster"
	"go.uber.org/zap"

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
	logger      *zap.Logger
	db          DBContext
	redis       rediscluster.RedisCluster
	app         *FiberApp
	middlewares *Middlewares
	querier     db.Querier
	services    *ServiceSet
	controllers *ControllerSet
	routers     []routers.IRouter
}

func InitServer() *Server {
	server := &Server{}
	server.logger = NewLogger()
	server.middlewares = NewMiddlewareSet(server.logger)
	server.app = NewFiberApp(server.middlewares.ErrorHandler)
	server.querier = db.New()
	server.db = NewDBClient(server.logger)
	server.redis = NewRedisStore(server.logger)

	server.services = &ServiceSet{
		ProfileV1: services.NewProfileServiceV1(server.db, server.querier),
	}

	server.controllers = &ControllerSet{
		ProfileV1: controllers.NewProfileControllerV1(server.services.ProfileV1),
	}

	server.routers = append(server.routers, routers.NewProfileRouter(server.controllers.ProfileV1))
	return server
}

type IServer interface {
	start()
	clean()
	shutdown(isRunning chan bool)
}

func (s *Server) start() {
	fiber := s.app
	port := fmt.Sprintf(":%d", fiber.Config.Port)
	if err := fiber.App.Listen(port); err != nil {
		s.logger.Error("Failed to start Config", zap.Error(err))
	}
}

func (s *Server) clean() {
	s.db.Close()
	s.redis.Close()
}

func (s *Server) shutdown(isRunning chan bool) {
	if s.app == nil {
		s.logger.Fatal("app not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	s.logger.Info("Gracefully shutting down the server...")

	if err := s.app.ShutdownWithTimeout(5 * time.Second); err != nil {
		s.logger.Error("Error during server shutdown", zap.Error(err))
	}

	s.logger.Info("Running cleanup tasks...")
	s.clean()

	s.logger.Info("Server shutdown complete.")

	isRunning <- false
}

func Boostrap() {
	isRunning := make(chan bool, 1)
	s := InitServer()

	logger := s.logger
	fiber := s.app
	middlewares := s.middlewares
	fiber.Use(middlewares.Logger)
	fiber.Use(middlewares.Recover)
	fiber.Use(middlewares.Cors)
	fiber.Use(middlewares.Compress)

	for _, router := range s.routers {
		router.AssignAPI(fiber.App)
	}

	logger.Info("Completed setting up Config!")
	go s.start()
	go s.shutdown(isRunning)
	<-isRunning
}
