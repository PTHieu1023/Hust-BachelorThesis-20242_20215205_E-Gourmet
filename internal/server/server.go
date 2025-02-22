package server

import (
	"e-gourmet/core/internal/middlewares/logger"
	"e-gourmet/core/internal/routers"
	"e-gourmet/core/internal/server/database"
	"e-gourmet/core/internal/server/fiber"
	logger2 "e-gourmet/core/internal/server/logger"
	"e-gourmet/core/internal/server/middleware"
	"fmt"
	"github.com/gofiber/fiber/v2/middleware/compress"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/swagger"
	"os"
	"os/signal"
	"syscall"
	"time"

	"go.uber.org/zap"
	//_ "hiusnef/e-gourmet/docs"
)

func Run() {
	isRunning := make(chan bool, 1)
	fiber.App().Use(logger.New(logger2.Logger()))
	fiber.App().Use(recover.New())
	fiber.App().Use(cors.New(cors.Config{
		AllowOrigins: middleware.MiddlewareConfig().Cors.AllowOrigins,
		AllowMethods: middleware.MiddlewareConfig().Cors.AllowMethods,
		AllowHeaders: middleware.MiddlewareConfig().Cors.AllowHeaders,
	}))
	fiber.App().Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))
	fiber.App().Static(middleware.MiddlewareConfig().Storage.URLPrefix, middleware.MiddlewareConfig().Storage.ResourcePath)

	fiber.App().Get("/api-docs/*", swagger.HandlerDefault)

	routers.AssignProfileService()
	// Assign router and handler into app
	database.PingDB()
	logger2.Logger().Info("Completed setting up server!")
	go start()
	go shutdown(isRunning)
	<-isRunning
}

func start() {
	port := fmt.Sprintf(":%d", fiber.AppConfig().Port)
	if err := fiber.App().Listen(port); err != nil {
		logger2.Logger().Error("Failed to start server", zap.Error(err))
	}
}

func stop() {
	database.CloseDB()
}

func shutdown(isRunning chan bool) {
	logger2.Logger().Info("Shutting down...")
	if fiber.App() == nil {
		logger2.Logger().Fatal("App not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	logger2.Logger().Info("Gracefully shutting down the server...")

	if err := fiber.App().ShutdownWithTimeout(5 * time.Second); err != nil {
		logger2.Logger().Error("Error during server shutdown", zap.Error(err))
	}

	logger2.Logger().Info("Running cleanup tasks...")
	stop()

	logger2.Logger().Info("Server shutdown complete.")

	// Notify the main goroutine
	isRunning <- false
}
