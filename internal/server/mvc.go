package server

import (
	"context"
	"e-gourmet/core/internal/controllers"
	"e-gourmet/core/internal/server/logger"
	"e-gourmet/core/internal/services"
	"e-gourmet/core/internal/utils"
	"errors"
	"fmt"
	"github.com/Nerzal/gocloak/v13"
	"github.com/gofiber/fiber/v2"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"
)

type Server struct {
	dbtx        *pgxpool.Pool
	kc          *gocloak.GoCloak
	middlewares *Middlewares
	services    services.IService
	controllers controllers.IController
	app         *fiber.App
}

func Boostrap() {
	isRunning := make(chan bool, 1)
	server := New()
	logger.Instance().Info("Completed setting up Config!")
	go server.start()
	go server.shutdown(isRunning)
	<-isRunning
}

func (s *Server) start() {
	port, err := strconv.Atoi(os.Getenv("PORT"))
	if err != nil || port <= 0 {
		port = 8080
	}
	if err := s.app.Listen(fmt.Sprintf(":%d", port)); err != nil {
		logger.Instance().Error("Failed to start Config", zap.Error(err))
	}
}

func (s *Server) clean() {
	s.dbtx.Close()
}

func (s *Server) shutdown(isRunning chan bool) {
	if s.app == nil {
		logger.Instance().Fatal("App not found")
	}

	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	<-signalChannel // Block until a termination signal is received

	logger.Instance().Info("Gracefully shutting down the server...")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	if err := s.app.ShutdownWithContext(ctx); err != nil {
		logger.Instance().Error("Error during server shutdown", zap.Error(err))
	}
	logger.Instance().Info("Running cleanup tasks...")
	s.clean()

	logger.Instance().Info("Server shutdown complete.")

	isRunning <- false
}

func New() *Server {
	server := new(Server)
	server.app = initApp()
	server.kc = gocloak.NewClient(utils.AuthIssuerUrl())
	server.dbtx = connectDB()

	server.middlewares = InitMiddlewares(server.kc)

	server.app.Use(server.middlewares.Timeout)
	server.app.Use(server.middlewares.Logger)
	server.app.Use(server.middlewares.Recover)
	server.app.Use(server.middlewares.Cors)
	server.app.Use(server.middlewares.Compress)
	server.app.Use(server.middlewares.Auth)

	server.services = services.New(server.dbtx, server.kc)
	server.controllers = controllers.New(server.services)

	routerV1 := server.app.Group("/api")
	routerV1.Group("/cuisine").
		Get("/", server.controllers.GetCuisines).
		Post("/", server.controllers.AddCuisine).
		Get("/:id", server.controllers.GetCuisines).
		Put("/", server.controllers.UpdateCuisine).
		Delete("/:id", server.controllers.DeleteCuisine)

	routerV1.Group("/dish").
		Get("/", server.controllers.GetDishes).
		Post("/", server.controllers.CreateDish).
		Group("/:id").
		Get("/", server.controllers.GetDishById).
		Delete("/", server.controllers.DeleteDishById)

	routerV1.Group("/review").
		Get("/", server.controllers.GetReviews).
		Post("/", server.controllers.CreateReview).
		Group("/:id").
		Delete("/", server.controllers.DeleteReview)

	routerV1.Group("/user").
		Get("/me", server.controllers.GetCurrentUser).
		Get("/:username", server.controllers.GetUserByUsername).
		Put("/", server.controllers.UpdateCurrentUser)

	routerV1.Group("/restaurant").
		Get("/", server.controllers.GetRestaurants).
		Get("/me", server.controllers.GetCurrentUserRestaurant).
		Post("/", server.controllers.CreateRestaurant).
		Group("/:id").
		Put("/", server.controllers.UpdateRestaurant).
		Delete("/", server.controllers.DeleteRestaurantById)

	routerV1.Group("/post").
		Get("/", server.controllers.GetPosts).
		Post("/", server.controllers.CreatePost).
		Group("/:id").
		Get("/", server.controllers.GetPostById).
		Put("/", server.controllers.UpdatePost).
		Delete("/", server.controllers.DeletePost).
		Post("/like", server.controllers.LikePost).
		Delete("/like", server.controllers.UnlikePost)

	// Post comments endpoints
	routerV1.Group("/post/:postId/comments").
		Get("/", server.controllers.GetCommentsByPost).
		Post("/", server.controllers.CreateComment)

	routerV1.Delete("/comments/:commentId", server.controllers.DeleteComment)

	routerV1.Get("/recommendations", server.controllers.GetRecommendations)

	// Upload routes
	routerV1.Group("/uploads").
		Post("/", server.controllers.UploadFile)

	server.app.Static("/uploads", "./etc/uploads")

	return server
}

func initApp() *fiber.App {
	return fiber.New(fiber.Config{
		AppName:       "E-Gourmet API",
		ServerHeader:  "E-Gourmet",
		Prefork:       false,
		CaseSensitive: true,
		Immutable:     false,
		ErrorHandler:  errorHandler(),
	})
}

func errorHandler() fiber.ErrorHandler {
	return func(c *fiber.Ctx, err error) error {
		code := fiber.StatusInternalServerError
		var fiberErr *fiber.Error
		if errors.Is(err, context.DeadlineExceeded) {
			code = fiber.StatusRequestTimeout
		} else if errors.As(err, &fiberErr) {
			code = fiberErr.Code
		}
		c.Status(code)

		fields := []zap.Field{
			zap.String("method", c.Method()),
			zap.String("ip", c.IP()),
			zap.Int("status", c.Response().StatusCode()),
			zap.String("latency", time.Since(c.Locals("startTime").(time.Time)).String()),
			zap.String("url", c.OriginalURL()),
			zap.String("error", err.Error()),
		}
		logger.Instance().Error("Error Request", fields...)
		json := fiber.Map{
			"time":    time.Now(),
			"status":  code,
			"message": http.StatusText(code),
		}
		if code != fiber.StatusInternalServerError {
			json["error"] = err.Error()
		}
		return c.JSON(json)
	}
}
