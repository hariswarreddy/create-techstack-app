import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface CreateItemBody {
  name: string;
  description?: string;
}

interface PrismaError extends Error {
  code?: string;
}

// Routes
app.get('/', (_req: Request, res: Response) => {
  res.json({ 
    message: 'Welcome to {{projectName}} API',
    version: '1.0.0'
  });
});

// Get all items
app.get('/api/items', async (_req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Get single item
app.get('/api/items/:id', async (req: Request, res: Response) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id: req.params.id }
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: message });
  }
});

// Create item
app.post('/api/items', async (req: Request<{}, {}, CreateItemBody>, res: Response) => {
  try {
    const item = await prisma.item.create({
      data: req.body
    });
    res.status(201).json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: message });
  }
});

// Update item
app.put('/api/items/:id', async (req: Request<{ id: string }, {}, CreateItemBody>, res: Response) => {
  try {
    const item = await prisma.item.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(item);
  } catch (error) {
    const err = error as PrismaError;
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Delete item
app.delete('/api/items/:id', async (req: Request, res: Response) => {
  try {
    await prisma.item.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    const err = error as PrismaError;
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(500).json({ error: err.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
