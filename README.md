# create-techstack-app 🚀

Interactive CLI to scaffold full-stack applications with your choice of frontend and backend technologies.

![npm version](https://img.shields.io/npm/v/create-techstack-app)
![license](https://img.shields.io/npm/l/create-techstack-app)

## Installation

```bash
# Using npx (recommended)
npx create-techstack-app my-project

# Or install globally
npm install -g create-techstack-app
create-techstack-app my-project
```

## Features

- 🎨 **Multiple Frontend Options**: React 19, Vue 3.5, Next.js 16, or Vanilla JavaScript
- 🎯 **Tailwind CSS v4 Support**: Modern CSS-first configuration for React and Next.js
- ⚙️ **Flexible Backend Choices**: Express 5 (with MongoDB/PostgreSQL/MySQL) or Go (Gin/Fiber)
- 📦 **Full TypeScript Support**: TypeScript for both frontend and backend
- 📊 **Progress Tracking**: Beautiful progress bar with percentage display
- 🔧 **Zero Configuration**: Get started immediately with sensible defaults
- ⚡ **Latest Versions**: All dependencies use the latest stable versions

## Quick Start

```bash
npx create-techstack-app my-app
```

Follow the interactive prompts:

1. **Project Type**: Full-stack, Frontend only, or Backend only
2. **Frontend Framework**: React, Vue, Next.js, or Vanilla JS
3. **Tailwind CSS**: Yes or No (for React/Next.js)
4. **Backend Stack**: Express+MongoDB, Express+PostgreSQL, Go+Gin, etc.
5. **TypeScript**: Yes or No (applies to both frontend and backend!)
6. **Git & Dependencies**: Initialize Git and install dependencies

## Available Templates

### Frontend

| Template         | Version          | Description                                        |
| ---------------- | ---------------- | -------------------------------------------------- |
| **React + Vite** | React 19, Vite 7 | Modern React with optional Tailwind CSS v4         |
| **Vue + Vite**   | Vue 3.5, Vite 7  | Vue 3 with Composition API                         |
| **Next.js**      | Next.js 16       | React framework with App Router, optional Tailwind |
| **Vanilla JS**   | Vite 7           | Plain JavaScript with Vite bundler                 |

### Backend

| Template                 | Version               | Description                          |
| ------------------------ | --------------------- | ------------------------------------ |
| **Express + MongoDB**    | Express 5, Mongoose 9 | Node.js with Mongoose ORM (JS or TS) |
| **Express + PostgreSQL** | Express 5, Prisma 7   | Node.js with Prisma ORM (JS or TS)   |
| **Express + MySQL**      | Express 5, Prisma 7   | Node.js with Prisma ORM (JS or TS)   |
| **Go + Gin**             | Gin 1.11              | Fast Go web framework                |
| **Go + Fiber**           | Fiber 2.52            | Express-inspired Go framework        |

## CLI Options

```bash
# Create with default options
npx create-techstack-app my-app --yes

# Specify frontend and backend
npx create-techstack-app my-app --frontend react --backend express-mongodb

# Show help
npx create-techstack-app --help
```

## Project Structure

### Full-stack Project

```
my-project/
├── frontend/          # Frontend application
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/           # Backend API
    ├── src/
    ├── package.json   # For JS backends
    └── tsconfig.json  # For TypeScript backends
```

### Frontend/Backend Only

```
my-project/
├── src/
├── package.json
└── ...
```

## Development

After scaffolding, navigate to your project and start developing:

```bash
# Full-stack project
cd my-project

# Start frontend
cd frontend && npm run dev

# Start backend (in another terminal)
cd backend && npm run dev
```

## What's New in v2.0.0

- 🆕 **TypeScript Backends**: Full TypeScript support for all Express backends
- 🎨 **Tailwind CSS v4**: Updated to latest Tailwind with CSS-first configuration
- 📊 **Progress Bar**: Visual progress tracking with percentage display
- ⚡ **Latest Versions**: React 19, Next.js 16, Vue 3.5, Vite 7, Express 5, Prisma 7
- 🎯 **Black & White Theme**: Clean, modern design for all templates
- 🔧 **Improved UX**: Dynamic step tracking based on project configuration

## Requirements

- **Node.js**: >= 18.0.0
- **Go**: >= 1.22 (only for Go backends)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Hariswar Reddy
