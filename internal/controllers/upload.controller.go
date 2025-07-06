package controllers

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"math/big"
	"os"
	"path/filepath"
	"strings"
)

func (c *EGControllerImpl) UploadFile(ctx *fiber.Ctx) error {
	file, err := ctx.FormFile("file")
	if err != nil {
		return fiber.NewError(fiber.StatusBadRequest, err.Error())
	}

	fileExt := strings.ToLower(filepath.Ext(file.Filename))
	baseFilename := strings.Replace(filepath.Base(file.Filename), fileExt, "", -1)

	// Create uploads directory if it doesn't exist
	uploadDir := "./etc/uploads"
	if _, err = os.Stat(uploadDir); os.IsNotExist(err) {
		err = os.MkdirAll(uploadDir, os.ModePerm)
		if err != nil {
			return err
		}
	}

	randInt, _ := rand.Int(rand.Reader, big.NewInt(1000000))
	uniqueID := base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("%s%d", uuid.New().String(), randInt.Int64())))
	fileName := fmt.Sprintf("%s_%s%s", baseFilename, uniqueID, fileExt)
	filePath := fmt.Sprintf("%s/%s", uploadDir, fileName)

	if err = ctx.SaveFile(file, filePath); err != nil {
		return err
	}

	// Return file information
	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"filename": fileName,
		"url":      fmt.Sprintf("/uploads/%s", fileName),
		"size":     file.Size,
		"mimetype": file.Header.Get("Content-Type"),
	})
}
