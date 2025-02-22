package initialize

import (
	"e-gourmet/core/internal/routers"
	"e-gourmet/core/internal/server"
	"fmt"
	"github.com/gofiber/swagger"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"

	// Built in middlewares
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"

	//Custom middlewares
	"e-gourmet/core/internal/middlewares/logger"
	//_ "hiusnef/e-gourmet/docs"
)

func stop() {
	server.CloseDB()
}

func shutdown(isRunning chan bool) {
	if server.App() == nil {
		server.Logger().Fatal("App not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	server.Logger().Info("Gracefully shutting down the server...")

	if err := server.App().ShutdownWithTimeout(5 * time.Second); err != nil {
		server.Logger().Error("Error during server shutdown", zap.Error(err))
	}

	server.Logger().Info("Running cleanup tasks...")
	stop()

	server.Logger().Info("Server shutdown complete.")

	// Notify the main goroutine
	isRunning <- false
}

func initialize() {
	server.App().Use(logger.New(server.Logger()))
	server.App().Use(recover.New())
	server.App().Use(cors.New(cors.Config{
		AllowOrigins: server.MiddlewareConfig().Cors.AllowOrigins,
		AllowMethods: server.MiddlewareConfig().Cors.AllowMethods,
		AllowHeaders: server.MiddlewareConfig().Cors.AllowHeaders,
	}))
	server.App().Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))
	server.App().Static(server.MiddlewareConfig().Storage.URLPrefix, server.MiddlewareConfig().Storage.ResourcePath)

	server.App().Get("/api-docs/*", swagger.HandlerDefault)

	routers.AssignProfileService()
	// Assign router and handler into app
	server.PingDB()
	server.Logger().Info("Completed setting up server!")
}

func Start() {
	isRunning := make(chan bool, 1)
	initialize()
	port := fmt.Sprintf(":%d", server.AppConfig().Port)
	if err := server.App().Listen(port); err != nil {
		server.Logger().Error("Failed to start server", zap.Error(err))
	}

	go shutdown(isRunning)
	<-isRunning
}
