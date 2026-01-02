import { execSync } from 'child_process';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { type ProjectConfig, type FrontendType, type BackendType } from './prompts.js';
import { copyDir, ensureDir, directoryExists, fileExists } from './utils/file.js';
import { ProgressTracker } from './utils/spinner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATES_DIR = join(__dirname, '..', 'templates');

export async function generateProject(config: ProjectConfig): Promise<void> {
  const projectPath = join(process.cwd(), config.projectName);

  // Check if directory/project already exists
  if (config.projectName === '.') {
    const packageJsonPath = join(projectPath, 'package.json');
    if (fileExists(packageJsonPath)) {
      throw new Error('A project already exists in the current directory (package.json found)');
    }
  } else if (directoryExists(projectPath)) {
    throw new Error(`Directory "${config.projectName}" already exists`);
  }

  // Build the list of steps based on configuration
  const steps = buildStepsList(config);
  const progress = new ProgressTracker(steps);
  progress.start();

  const replacements = {
    projectName: config.projectName,
    year: new Date().getFullYear().toString(),
  };

  try {
    // Step 1: Create project directory
    ensureDir(projectPath);
    progress.nextStep('Project directory created');

    // Step 2: Generate frontend (if applicable)
    if (config.frontend !== 'none') {
      const frontendPath = config.projectType === 'fullstack' 
        ? join(projectPath, 'frontend')
        : projectPath;

      generateFrontendSync(config.frontend, frontendPath, config.useTailwind, replacements);
      const label = config.useTailwind && (config.frontend === 'react' || config.frontend === 'nextjs')
        ? `${config.frontend} + Tailwind frontend generated`
        : `${config.frontend} frontend generated`;
      progress.nextStep(label);
    }

    // Step 3: Generate backend (if applicable)
    if (config.backend !== 'none') {
      const backendPath = config.projectType === 'fullstack'
        ? join(projectPath, 'backend')
        : projectPath;

      generateBackendSync(config.backend, backendPath, config.typescript, replacements);
      const label = config.typescript && config.backend.startsWith('express-')
        ? `${config.backend} (TypeScript) backend generated`
        : `${config.backend} backend generated`;
      progress.nextStep(label);
    }

    // Step 4: Initialize git (if applicable)
    if (config.initGit) {
      execSync('git init', { cwd: projectPath, stdio: 'ignore' });
      progress.nextStep('Git repository initialized');
    }

    // Step 5+: Install dependencies (if applicable)
    if (config.installDeps) {
      if (config.projectType === 'fullstack') {
        if (config.frontend !== 'none') {
          const frontendPath = join(projectPath, 'frontend');
          execSync('npm install', { cwd: frontendPath, stdio: 'ignore' });
          progress.nextStep('Frontend dependencies installed');
        }
        if (config.backend !== 'none' && !config.backend.startsWith('go-')) {
          const backendPath = join(projectPath, 'backend');
          execSync('npm install', { cwd: backendPath, stdio: 'ignore' });
          progress.nextStep('Backend dependencies installed');
        }
      } else {
        if (!config.backend.startsWith('go-')) {
          execSync('npm install', { cwd: projectPath, stdio: 'ignore' });
          progress.nextStep('Dependencies installed');
        }
      }

      // For Go projects, run go mod tidy
      if (config.backend.startsWith('go-')) {
        const goPath = config.projectType === 'fullstack'
          ? join(projectPath, 'backend')
          : projectPath;
        execSync('go mod tidy', { cwd: goPath, stdio: 'ignore' });
        progress.nextStep('Go dependencies resolved');
      }
    }

    progress.complete('Project created successfully! 🎉');
  } catch (error) {
    progress.fail(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

function buildStepsList(config: ProjectConfig): string[] {
  const steps: string[] = ['Creating project directory...'];

  if (config.frontend !== 'none') {
    const label = config.useTailwind && (config.frontend === 'react' || config.frontend === 'nextjs')
      ? `Generating ${config.frontend} + Tailwind frontend...`
      : `Generating ${config.frontend} frontend...`;
    steps.push(label);
  }

  if (config.backend !== 'none') {
    const label = config.typescript && config.backend.startsWith('express-')
      ? `Generating ${config.backend} (TypeScript) backend...`
      : `Generating ${config.backend} backend...`;
    steps.push(label);
  }

  if (config.initGit) {
    steps.push('Initializing Git repository...');
  }

  if (config.installDeps) {
    if (config.projectType === 'fullstack') {
      if (config.frontend !== 'none') {
        steps.push('Installing frontend dependencies...');
      }
      if (config.backend !== 'none' && !config.backend.startsWith('go-')) {
        steps.push('Installing backend dependencies...');
      }
    } else if (!config.backend.startsWith('go-')) {
      steps.push('Installing dependencies...');
    }

    if (config.backend.startsWith('go-')) {
      steps.push('Resolving Go dependencies...');
    }
  }

  return steps;
}

function generateFrontendSync(
  type: FrontendType,
  destPath: string,
  useTailwind: boolean,
  replacements: Record<string, string>
): void {
  let templateName = type;
  if ((type === 'react' || type === 'nextjs') && useTailwind) {
    const tailwindTemplatePath = join(TEMPLATES_DIR, 'frontend', `${type}-tailwind`);
    if (directoryExists(tailwindTemplatePath)) {
      templateName = `${type}-tailwind` as FrontendType;
    }
  }

  const templatePath = join(TEMPLATES_DIR, 'frontend', templateName);
  copyDir(templatePath, destPath, replacements);
}

function generateBackendSync(
  type: BackendType,
  destPath: string,
  useTypescript: boolean,
  replacements: Record<string, string>
): void {
  let templateName = type;
  if (useTypescript && type.startsWith('express-')) {
    const tsTemplatePath = join(TEMPLATES_DIR, 'backend', `${type}-ts`);
    if (directoryExists(tsTemplatePath)) {
      templateName = `${type}-ts` as BackendType;
    }
  }

  const templatePath = join(TEMPLATES_DIR, 'backend', templateName);
  copyDir(templatePath, destPath, replacements);
}
