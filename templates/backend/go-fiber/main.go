package main

import (
	"os"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

type Item struct {
	ID          string    `json:"id"`
	Name        string    `json:"name"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
}

var items = []Item{}
var idCounter = 0

func main() {
	// Load environment variables
	godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = "5000"
	}

	// Create Fiber app
	app := fiber.New(fiber.Config{
		AppName: "{{projectName}} API v1.0.0",
	})

	// CORS middleware
	app.Use(cors.New())

	// Routes
	app.Get("/", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"message": "Welcome to {{projectName}} API",
			"version": "1.0.0",
		})
	})

	// Get all items
	app.Get("/api/items", func(c *fiber.Ctx) error {
		return c.JSON(items)
	})

	// Get single item
	app.Get("/api/items/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		for _, item := range items {
			if item.ID == id {
				return c.JSON(item)
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	})

	// Create item
	app.Post("/api/items", func(c *fiber.Ctx) error {
		var newItem Item
		if err := c.BodyParser(&newItem); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}
		if newItem.Name == "" {
			return c.Status(400).JSON(fiber.Map{"error": "Name is required"})
		}
		idCounter++
		newItem.ID = strconv.Itoa(idCounter)
		newItem.CreatedAt = time.Now()
		items = append(items, newItem)
		return c.Status(201).JSON(newItem)
	})

	// Update item
	app.Put("/api/items/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		var updatedItem Item
		if err := c.BodyParser(&updatedItem); err != nil {
			return c.Status(400).JSON(fiber.Map{"error": err.Error()})
		}
		for i, item := range items {
			if item.ID == id {
				updatedItem.ID = id
				updatedItem.CreatedAt = item.CreatedAt
				items[i] = updatedItem
				return c.JSON(updatedItem)
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	})

	// Delete item
	app.Delete("/api/items/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")
		for i, item := range items {
			if item.ID == id {
				items = append(items[:i], items[i+1:]...)
				return c.JSON(fiber.Map{"message": "Item deleted successfully"})
			}
		}
		return c.Status(404).JSON(fiber.Map{"error": "Item not found"})
	})

	// Start server
	println("🚀 Server running on http://localhost:" + port)
	app.Listen(":" + port)
}
