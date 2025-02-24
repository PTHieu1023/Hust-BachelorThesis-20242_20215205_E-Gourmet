package server

import (
	reqlogger "e-gourmet/core/internal/middlewares/logger"
	"e-gourmet/core/internal/routers"
	"e-gourmet/core/internal/server/database"
	"e-gourmet/core/internal/server/fiber"
	"e-gourmet/core/internal/server/logger"
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
	fiber.App().Use(reqlogger.New(logger.Log()))
	fiber.App().Use(recover.New())
	fiber.App().Use(cors.New(cors.Config{
		AllowOrigins: middleware.Config().Cors.AllowOrigins,
		AllowMethods: middleware.Config().Cors.AllowMethods,
		AllowHeaders: middleware.Config().Cors.AllowHeaders,
	}))
	fiber.App().Use(compress.New(compress.Config{
		Level: compress.LevelBestSpeed,
	}))
	fiber.App().Static(middleware.Config().Storage.URLPrefix, middleware.Config().Storage.ResourcePath)

	fiber.App().Get("/api-docs/*", swagger.HandlerDefault)

	routers.AssignProfileService()
	// Assign router and handler into app
	database.PingDB()
	logger.Log().Info("Completed setting up server!")
	go start()
	go shutdown(isRunning)
	<-isRunning
}

func start() {
	port := fmt.Sprintf(":%d", fiber.Config().Port)
	if err := fiber.App().Listen(port); err != nil {
		logger.Log().Error("Failed to start server", zap.Error(err))
	}
}

func clean() {
	database.CloseDB()
}

func shutdown(isRunning chan bool) {
	logger.Log().Info("Shutting down...")
	if fiber.App() == nil {
		logger.Log().Fatal("App not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	logger.Log().Info("Gracefully shutting down the server...")

	if err := fiber.App().ShutdownWithTimeout(5 * time.Second); err != nil {
		logger.Log().Error("Error during server shutdown", zap.Error(err))
	}

	logger.Log().Info("Running cleanup tasks...")
	clean()

	logger.Log().Info("Server shutdown complete.")

	// Notify the main goroutine
	isRunning <- false
}
