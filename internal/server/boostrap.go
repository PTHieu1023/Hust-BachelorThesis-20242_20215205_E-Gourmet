package server

import (
	"context"
	"e-gourmet/core/internal/server/kc"
	"e-gourmet/core/internal/server/logger"
	"fmt"
	"go.uber.org/zap"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func Boostrap() {
	isRunning := make(chan bool, 1)

	InitHandler()

	logger.Instance().Info("Completed setting up Config!")
	go start()
	go shutdown(isRunning)
	<-isRunning
}

func start() {
	if err := AppInstance().Listen(fmt.Sprintf(":%d", _port)); err != nil {
		logger.Instance().Error("Failed to start Config", zap.Error(err))
	}
}

func clean(ctx context.Context) {
	closeDB()
	kc.Instance().CloseSession(ctx)
}

func shutdown(isRunning chan bool) {
	if AppInstance() == nil {
		logger.Instance().Fatal("App not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	logger.Instance().Info("Gracefully shutting down the server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := AppInstance().ShutdownWithContext(ctx); err != nil {
		logger.Instance().Error("Error during server shutdown", zap.Error(err))
	}
	logger.Instance().Info("Running cleanup tasks...")
	clean(ctx)

	logger.Instance().Info("Server shutdown complete.")

	isRunning <- false
}
