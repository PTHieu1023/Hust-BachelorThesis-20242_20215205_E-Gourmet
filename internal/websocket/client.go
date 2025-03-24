package websocket

import (
	"go.uber.org/zap"

	"github.com/gofiber/contrib/websocket"
	"github.com/google/uuid"
)

type Message struct {
	Data  string `json:"data,omitempty"`
	From  string `json:"from,omitempty"`
	To    string `json:"to,omitempty"`
	Topic string `json:"topic,omitempty"`
}

type Client struct {
	conn        *websocket.Conn
	rooms       map[string]bool
	uuid        uuid.UUID
	server      *Server
	isConnected bool
}

func newClient(conn *websocket.Conn) *Client {
	return &Client{
		conn:  conn,
		rooms: make(map[string]bool),
	}
}

func (c *Client) join(roomId string) {
	c.server.addToRoom(c, roomId)
}

func (c *Client) leave(roomId string) {
	c.server.removeFromRoom(c, roomId)
}

func (c *Client) emit(message *Message) {
	err := c.conn.WriteJSON(message)
	if err != nil {
		c.server.logger.Error("Error send message To client", zap.Error(err))
		c.isConnected = false
	}
}

func (c *Client) emitRoom(message *Message, roomId string) {
	if _, ok := c.rooms[roomId]; !ok {
		message.Topic = "error"
		message.Data = "client is not assigned To this room"
		c.emit(message)
		return
	}
	for _, client := range c.server.rooms[roomId] {
		client.emit(message)
	}
}
