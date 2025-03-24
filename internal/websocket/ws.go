package websocket

import (
	"encoding/json"
	"fmt"
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"sync"

	"go.uber.org/zap"
)

type TopicHandler func(*Client, *Message) error

type Server struct {
	clients  map[uuid.UUID]*Client
	rooms    map[string]map[uuid.UUID]*Client
	logger   *zap.Logger
	mu       *sync.RWMutex
	handlers map[string]TopicHandler
}

func New(logger *zap.Logger) *Server {
	return &Server{
		clients:  make(map[uuid.UUID]*Client),
		rooms:    make(map[string]map[uuid.UUID]*Client),
		logger:   logger,
		handlers: make(map[string]TopicHandler),
		mu:       &sync.RWMutex{},
	}
}

func EnableWebsocket() fiber.Handler {
	return func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	}
}

func (s *Server) Emit(clientID uuid.UUID, message *Message) {
	client, ok := s.clients[clientID]
	if !ok {
		s.logger.Error("client not found", zap.String("clientID", clientID.String()))
		return
	}
	client.emit(message)
}

func (s *Server) ServeHTTP() fiber.Handler {
	return websocket.New(func(conn *websocket.Conn) {
		client := newClient(conn)
		s.connect(client)
		defer s.disconnect(client)
		for client.isConnected {
			message := &Message{}
			_, data, err := client.conn.ReadMessage()
			if err != nil {
				s.logger.Error("failed to read message", zap.Error(err))
				message.Data = err.Error()
				message.Topic = "error"
				client.emit(message)
				continue
			}
			err = json.Unmarshal(data, &message)
			if err != nil {
				s.logger.Error("failed to read message", zap.Error(err))
				message.Data = err.Error()
				message.Topic = "error"
				client.emit(message)
				continue
			}
			s.handleMessage(client, message)
		}
	})
}

func (s *Server) connect(client *Client) {
	s.mu.Lock()
	client.uuid = uuid.New()
	s.clients[client.uuid] = client
	client.server = s
	client.isConnected = true

	username := client.conn.Locals("username").(string)
	s.addToRoom(client, username)
	s.mu.Unlock()
}

func (s *Server) disconnect(client *Client) {
	s.mu.Lock()
	defer s.mu.Unlock()

	delete(s.clients, client.uuid)
	for room := range client.rooms {
		delete(s.rooms[room], client.uuid)
	}
	_ = client.conn.Close()
}

func (s *Server) addToRoom(client *Client, room string) {
	if _, ok := s.rooms[room]; !ok {
		s.rooms[room] = make(map[uuid.UUID]*Client)
	}
	s.rooms[room][client.uuid] = client
	client.rooms[room] = true
}

func (s *Server) removeFromRoom(client *Client, room string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.rooms[room]; !ok {
		return
	}
	delete(s.rooms[room], client.uuid)
	delete(client.rooms, room)
}

func (s *Server) handleMessage(client *Client, message *Message) {
	s.logger.Info(fmt.Sprintf("Received message: %s", message.Data))
	message.Data = "Received message: " + message.Data
	client.emit(message)
}
