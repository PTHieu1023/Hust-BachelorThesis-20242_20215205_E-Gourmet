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

type Pagination[T any] struct {
	Page       int  `json:"page"`
	Size       int  `json:"size"`
	Count      int  `json:"total"`
	TotalPage  int  `json:"totalPage"`
	TotalCount int  `json:"totalCount"`
	Content    []*T `json:"content"`
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

	if filter.Page < 1 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "'page' must be greater than or equal to 1")
	}

	if filter.Size < 1 {
		return nil, fiber.NewError(fiber.StatusBadRequest, "'size' must be greater than or equal to 1")
	}

	orderByStr := c.Query("orderBy", "")
	if orderByStr != "" {
		filter.OrderBy = strings.Split(orderByStr, ",")
	}

	return &filter, nil
}
