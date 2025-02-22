package pagination

import (
	"github.com/gofiber/fiber/v2"
	"strconv"
	"strings"
)

type PageFilter struct {
	Page    int      `json:"page"`
	Size    int      `json:"size"`
	OrderBy []string `json:"orderBy"`
}

type Pagination struct {
	Page       int           `json:"page"`
	Size       int           `json:"size"`
	Count      int           `json:"total"`
	TotalPage  int           `json:"totalPage"`
	TotalCount int           `json:"totalCount"`
	Content    []interface{} `json:"content"`
}

func GetPageFilter(c *fiber.Ctx) (*PageFilter, error) {
	var filter PageFilter
	var err error

	filter.Page, err = strconv.Atoi(c.Query("page", "1"))
	if err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid 'page' parameter")
	}

	filter.Size, err = strconv.Atoi(c.Query("size", "10"))
	if err != nil {
		return nil, fiber.NewError(fiber.StatusBadRequest, "Invalid 'size' parameter")
	}

	orderByStr := c.Query("orderBy", "")
	if orderByStr != "" {
		filter.OrderBy = strings.Split(orderByStr, ",")
	}

	return &filter, nil
}
