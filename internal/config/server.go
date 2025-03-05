package config

import (
	"e-gourmet/core/internal/config/database"
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/routers"
	"e-gourmet/core/internal/services"
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
	Logger      *zap.Logger
	DBContext   database.DBContext
	FiberApp    *FiberApp
	Middlewares *Middlewares
	Services    *ServiceSet
	Controllers *ControllerSet
	Routers     []routers.IRouter
}

func InitServer() *Server {
	server := &Server{}
	server.Logger = NewLogger()
	server.Middlewares = NewMiddlewareSet(server.Logger)
	server.FiberApp = NewFiberApp(server.Middlewares.ErrorHandler)
	server.DBContext = database.NewDBStore(server.Logger)

	server.Services = &ServiceSet{
		ProfileV1: services.NewProfileServiceV1(server.DBContext),
	}

	server.Controllers = &ControllerSet{
		ProfileV1: controllers.NewProfileControllerV1(server.Services.ProfileV1),
	}

	server.Routers = append(server.Routers, routers.NewProfileRouter(server.Controllers.ProfileV1))
	return server
}

type IServer interface {
	start()
	clean()
	shutdown(isRunning chan bool)
}

func (s *Server) start() {
	fiber := s.FiberApp
	port := fmt.Sprintf(":%d", fiber.Config.Port)
	if err := fiber.App.Listen(port); err != nil {
		s.Logger.Error("Failed to start Config", zap.Error(err))
	}
}

func (s *Server) clean() {
	s.DBContext.Close()
}

func (s *Server) shutdown(isRunning chan bool) {
	s.Logger.Info("Shutting down...")
	if s.FiberApp == nil {
		s.Logger.Fatal("FiberApp not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	s.Logger.Info("Gracefully shutting down the Config...")

	if err := s.FiberApp.ShutdownWithTimeout(5 * time.Second); err != nil {
		s.Logger.Error("Error during Config shutdown", zap.Error(err))
	}

	s.Logger.Info("Running cleanup tasks...")
	s.clean()

	s.Logger.Info("Server shutdown complete.")

	// Notify the main goroutine
	isRunning <- false
}

func Boostrap() {
	isRunning := make(chan bool, 1)
	s := InitServer()

	logger := s.Logger
	fiber := s.FiberApp
	middlewares := s.Middlewares
	fiber.Use(middlewares.Logger)
	fiber.Use(middlewares.Recover)
	fiber.Use(middlewares.Cors)
	fiber.Use(middlewares.Compress)

	for _, router := range s.Routers {
		router.AssignAPI(fiber.App)
	}

	// Assign router and handler into app
	s.DBContext.Ping()
	logger.Info("Completed setting up Config!")
	go s.start()
	go s.shutdown(isRunning)
	<-isRunning
}
