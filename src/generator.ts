import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { type ProjectConfig, type FrontendType, type BackendType } from './prompts.js';
import { copyDir, ensureDir, directoryExists, fileExists } from './utils/file.js';
import { withSpinner } from './utils/spinner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = join(__dirname, '..', 'templates');

export async function generateProject(config: ProjectConfig): Promise<void> {
  const projectPath = join(process.cwd(), config.projectName);

  // Check if directory/project already exists
  // For "." (current directory), only error if package.json exists
  // For other directories, error if the directory exists
  if (config.projectName === '.') {
    const packageJsonPath = join(projectPath, 'package.json');
    if (fileExists(packageJsonPath)) {
      throw new Error('A project already exists in the current directory (package.json found)');
    }
  } else if (directoryExists(projectPath)) {
    throw new Error(`Directory "${config.projectName}" already exists`);
  }

  // Create project directory
  await withSpinner(
    'Creating project directory...',
    async () => {
      ensureDir(projectPath);
    },
    'Project directory created'
  );

  const replacements = {
    projectName: config.projectName,
    year: new Date().getFullYear().toString(),
  };

  // Generate frontend
  if (config.frontend !== 'none') {
    const frontendPath = config.projectType === 'fullstack' 
      ? join(projectPath, 'frontend')
      : projectPath;

    await generateFrontend(config.frontend, frontendPath, config.useTailwind, replacements);
  }

  // Generate backend
  if (config.backend !== 'none') {
    const backendPath = config.projectType === 'fullstack'
      ? join(projectPath, 'backend')
      : projectPath;

    await generateBackend(config.backend, backendPath, replacements);
  }

  // Initialize git
  if (config.initGit) {
    await withSpinner(
      'Initializing Git repository...',
      async () => {
        execSync('git init', { cwd: projectPath, stdio: 'ignore' });
      },
      'Git repository initialized'
    );
  }

  // Install dependencies
  if (config.installDeps) {
    if (config.projectType === 'fullstack') {
      if (config.frontend !== 'none') {
        const frontendPath = join(projectPath, 'frontend');
        await installDependencies(frontendPath, 'frontend');
      }
      if (config.backend !== 'none' && !config.backend.startsWith('go-')) {
        const backendPath = join(projectPath, 'backend');
        await installDependencies(backendPath, 'backend');
      }
    } else {
      if (!config.backend.startsWith('go-')) {
        await installDependencies(projectPath, 'project');
      }
    }

    // For Go projects, run go mod tidy
    if (config.backend.startsWith('go-')) {
      const goPath = config.projectType === 'fullstack'
        ? join(projectPath, 'backend')
        : projectPath;
      await withSpinner(
        'Running go mod tidy...',
        async () => {
          execSync('go mod tidy', { cwd: goPath, stdio: 'ignore' });
        },
        'Go dependencies resolved'
      );
    }
  }
}

async function generateFrontend(
  type: FrontendType,
  destPath: string,
  useTailwind: boolean,
  replacements: Record<string, string>
): Promise<void> {
  // For React and Next.js, check if Tailwind version exists
  let templateName = type;
  if ((type === 'react' || type === 'nextjs') && useTailwind) {
    const tailwindTemplatePath = join(TEMPLATES_DIR, 'frontend', `${type}-tailwind`);
    if (directoryExists(tailwindTemplatePath)) {
      templateName = `${type}-tailwind` as FrontendType;
    }
  }

  const templatePath = join(TEMPLATES_DIR, 'frontend', templateName);
  const label = useTailwind && (type === 'react' || type === 'nextjs') 
    ? `${type} + Tailwind` 
    : type;

  await withSpinner(
    `Generating ${label} frontend...`,
    async () => {
      copyDir(templatePath, destPath, replacements);
    },
    `${label} frontend generated`
  );
}

async function generateBackend(
  type: BackendType,
  destPath: string,
  replacements: Record<string, string>
): Promise<void> {
  const templatePath = join(TEMPLATES_DIR, 'backend', type);

  await withSpinner(
    `Generating ${type} backend...`,
    async () => {
      copyDir(templatePath, destPath, replacements);
    },
    `${type} backend generated`
  );
}

async function installDependencies(path: string, name: string): Promise<void> {
  await withSpinner(
    `Installing ${name} dependencies...`,
    async () => {
      execSync('npm install', { cwd: path, stdio: 'ignore' });
    },
    `${name} dependencies installed`
  );
}
