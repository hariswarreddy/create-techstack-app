# create-techstack-app 🚀

Interactive CLI to scaffold full-stack applications with your choice of frontend and backend technologies.

## Installation

```bash
# Using npx (recommended)
npx create-techstack-app my-project

# Or install globally
npm install -g create-techstack-app
create-techstack-app my-project
```

## Features

- 🎨 **Multiple Frontend Options**: React, Vue, Next.js, or Vanilla JavaScript
- 🎯 **Tailwind CSS Support**: Optional Tailwind CSS for React and Next.js
- ⚙️ **Flexible Backend Choices**: Express (with MongoDB/PostgreSQL/MySQL) or Go (Gin/Fiber)
- 📦 **TypeScript Support**: Optional TypeScript for both frontend and backend
- 🔧 **Zero Configuration**: Get started immediately with sensible defaults
- ⚡ **Fast Setup**: Automatic dependency installation

## Quick Start

```bash
npx create-techstack-app my-app
```

Then follow the interactive prompts to select:

1. **Project Type**: Full-stack, Frontend only, or Backend only
2. **Frontend Framework**: React, Vue, Next.js, or Vanilla JS
3. **Tailwind CSS**: Yes or No (for React/Next.js)
4. **Backend Stack**: Express+MongoDB, Express+PostgreSQL, Go+Gin, etc.
5. **TypeScript**: Yes or No
6. **Git & Dependencies**: Initialize Git and install dependencies

## Available Templates

### Frontend

| Template         | Description                                             |
| ---------------- | ------------------------------------------------------- |
| **React + Vite** | React 18 with Vite (optional Tailwind CSS)              |
| **Vue + Vite**   | Vue 3 with Composition API and Vite                     |
| **Next.js 15**   | React framework with App Router (optional Tailwind CSS) |
| **Vanilla JS**   | Plain JavaScript with Vite bundler                      |

### Backend

| Template                 | Description                   |
| ------------------------ | ----------------------------- |
| **Express + MongoDB**    | Node.js with Mongoose ORM     |
| **Express + PostgreSQL** | Node.js with Prisma ORM       |
| **Express + MySQL**      | Node.js with Prisma ORM       |
| **Go + Gin**             | Fast Go web framework         |
| **Go + Fiber**           | Express-inspired Go framework |

## CLI Options

```bash
# Create with default options (includes Tailwind)
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
    ├── package.json
    └── ...
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

## Requirements

- **Node.js**: >= 18.0.0
- **Go**: >= 1.21 (only for Go backends)

## What's New in v1.1.0

- ✨ **Tailwind CSS Option**: Choose Tailwind CSS for React and Next.js projects
- 🆕 **Next.js 15**: Updated to latest Next.js with React 19
- 🎨 **Beautiful Templates**: Modern gradient designs with glassmorphism

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Hariswar Reddy
