import inquirer from 'inquirer';
import { logger } from './utils/logger.js';

export type FrontendType = 'react' | 'vue' | 'nextjs' | 'vanilla' | 'none';
export type BackendType = 'express-mongodb' | 'express-postgres' | 'express-mysql' | 'go-gin' | 'go-fiber' | 'none';
export type ProjectType = 'fullstack' | 'frontend' | 'backend';

export interface ProjectConfig {
  projectName: string;
  projectType: ProjectType;
  frontend: FrontendType;
  backend: BackendType;
  useTailwind: boolean;
  typescript: boolean;
  initGit: boolean;
  installDeps: boolean;
}

interface CLIOptions {
  yes?: boolean;
  frontend?: string;
  backend?: string;
}

const FRONTEND_CHOICES = [
  { name: '⚛️  React with Vite', value: 'react' },
  { name: '💚 Vue with Vite', value: 'vue' },
  { name: '▲  Next.js 16', value: 'nextjs' },
  { name: '📦 Vanilla JavaScript', value: 'vanilla' },
];

const BACKEND_CHOICES = [
  { name: '🍃 Node.js + Express + MongoDB', value: 'express-mongodb' },
  { name: '🐘 Node.js + Express + PostgreSQL', value: 'express-postgres' },
  { name: '🐬 Node.js + Express + MySQL', value: 'express-mysql' },
  { name: '🔵 Go + Gin', value: 'go-gin' },
  { name: '⚡ Go + Fiber', value: 'go-fiber' },
];

export async function promptUser(
  projectName?: string,
  options?: CLIOptions
): Promise<ProjectConfig> {
  const answers: Partial<ProjectConfig> = {};

  // Project name
  if (projectName) {
    answers.projectName = projectName;
  } else {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is your project name?',
        default: 'my-fullstack-app',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          if (!/^[a-z0-9-_]+$/i.test(input)) {
            return 'Project name can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
    ]);
    answers.projectName = name;
  }

  // Use defaults if --yes flag
  if (options?.yes) {
    return {
      projectName: answers.projectName!,
      projectType: 'fullstack',
      frontend: 'react',
      backend: 'express-mongodb',
      useTailwind: true,
      typescript: true,
      initGit: true,
      installDeps: true,
    };
  }

  // Project type
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'What would you like to create?',
      choices: [
        { name: 'Full Stack (Frontend + Backend)', value: 'fullstack' },
        { name: 'Frontend only', value: 'frontend' },
        { name: 'Backend only', value: 'backend' },
      ],
    },
  ]);
  answers.projectType = projectType;

  // Frontend selection
  if (projectType === 'fullstack' || projectType === 'frontend') {
    if (options?.frontend && isValidFrontend(options.frontend)) {
      answers.frontend = options.frontend as FrontendType;
    } else {
      const { frontend } = await inquirer.prompt([
        {
          type: 'list',
          name: 'frontend',
          message: 'Choose your frontend framework:',
          choices: FRONTEND_CHOICES,
        },
      ]);
      answers.frontend = frontend;
    }

    // Ask about Tailwind CSS (for React and Next.js)
    if (answers.frontend === 'react' || answers.frontend === 'nextjs') {
      const { useTailwind } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'useTailwind',
          message: 'Would you like to use Tailwind CSS?',
          default: true,
        },
      ]);
      answers.useTailwind = useTailwind;
    } else {
      answers.useTailwind = false;
    }
  } else {
    answers.frontend = 'none';
    answers.useTailwind = false;
  }

  // Backend selection
  if (projectType === 'fullstack' || projectType === 'backend') {
    if (options?.backend && isValidBackend(options.backend)) {
      answers.backend = options.backend as BackendType;
    } else {
      const { backend } = await inquirer.prompt([
        {
          type: 'list',
          name: 'backend',
          message: 'Choose your backend stack:',
          choices: BACKEND_CHOICES,
        },
      ]);
      answers.backend = backend;
    }
  } else {
    answers.backend = 'none';
  }

  // TypeScript preference
  const { typescript } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      default: true,
    },
  ]);
  answers.typescript = typescript;

  // Additional options
  const { initGit, installDeps } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize a Git repository?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies after scaffolding?',
      default: true,
    },
  ]);
  answers.initGit = initGit;
  answers.installDeps = installDeps;

  // Summary
  console.log();
  logger.info('📋 Project Configuration:');
  console.log();
  console.log(`   Project Name:  ${answers.projectName}`);
  console.log(`   Type:          ${formatProjectType(answers.projectType!)}`);
  if (answers.frontend !== 'none') {
    console.log(`   Frontend:      ${formatFrontend(answers.frontend!)}`);
    if (answers.frontend === 'react' || answers.frontend === 'nextjs') {
      console.log(`   Tailwind CSS:  ${answers.useTailwind ? 'Yes' : 'No'}`);
    }
  }
  if (answers.backend !== 'none') {
    console.log(`   Backend:       ${formatBackend(answers.backend!)}`);
  }
  console.log(`   TypeScript:    ${answers.typescript ? 'Yes' : 'No'}`);
  console.log(`   Git:           ${answers.initGit ? 'Yes' : 'No'}`);
  console.log(`   Install Deps:  ${answers.installDeps ? 'Yes' : 'No'}`);
  console.log();

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Proceed with this configuration?',
      default: true,
    },
  ]);

  if (!confirm) {
    throw new Error('Project creation cancelled');
  }

  return answers as ProjectConfig;
}

function isValidFrontend(value: string): boolean {
  return ['react', 'vue', 'nextjs', 'vanilla'].includes(value);
}

function isValidBackend(value: string): boolean {
  return ['express-mongodb', 'express-postgres', 'express-mysql', 'go-gin', 'go-fiber'].includes(value);
}

function formatProjectType(type: ProjectType): string {
  const map: Record<ProjectType, string> = {
    fullstack: 'Full-stack',
    frontend: 'Frontend only',
    backend: 'Backend only',
  };
  return map[type];
}

function formatFrontend(frontend: FrontendType): string {
  const map: Record<FrontendType, string> = {
    react: 'React + Vite',
    vue: 'Vue + Vite',
    nextjs: 'Next.js 15',
    vanilla: 'Vanilla JavaScript',
    none: 'None',
  };
  return map[frontend];
}

function formatBackend(backend: BackendType): string {
  const map: Record<BackendType, string> = {
    'express-mongodb': 'Express + MongoDB',
    'express-postgres': 'Express + PostgreSQL',
    'express-mysql': 'Express + MySQL',
    'go-gin': 'Go + Gin',
    'go-fiber': 'Go + Fiber',
    none: 'None',
  };
  return map[backend];
}
