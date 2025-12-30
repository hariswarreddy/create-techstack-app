package main

import (
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type Item struct {
	ID          string    `json:"id"`
	Name        string    `json:"name" binding:"required"`
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

	// Create Gin router
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Routes
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Welcome to {{projectName}} API",
			"version": "1.0.0",
		})
	})

	// Get all items
	r.GET("/api/items", func(c *gin.Context) {
		c.JSON(http.StatusOK, items)
	})

	// Get single item
	r.GET("/api/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		for _, item := range items {
			if item.ID == id {
				c.JSON(http.StatusOK, item)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
	})

	// Create item
	r.POST("/api/items", func(c *gin.Context) {
		var newItem Item
		if err := c.ShouldBindJSON(&newItem); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		idCounter++
		newItem.ID = string(rune(idCounter))
		newItem.CreatedAt = time.Now()
		items = append(items, newItem)
		c.JSON(http.StatusCreated, newItem)
	})

	// Update item
	r.PUT("/api/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		var updatedItem Item
		if err := c.ShouldBindJSON(&updatedItem); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		for i, item := range items {
			if item.ID == id {
				updatedItem.ID = id
				updatedItem.CreatedAt = item.CreatedAt
				items[i] = updatedItem
				c.JSON(http.StatusOK, updatedItem)
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
	})

	// Delete item
	r.DELETE("/api/items/:id", func(c *gin.Context) {
		id := c.Param("id")
		for i, item := range items {
			if item.ID == id {
				items = append(items[:i], items[i+1:]...)
				c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
				return
			}
		}
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
	})

	// Start server
	println("🚀 Server running on http://localhost:" + port)
	r.Run(":" + port)
}
