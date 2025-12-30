import { Command } from 'commander';
import { promptUser, type ProjectConfig } from './prompts.js';
import { generateProject } from './generator.js';
import { logger } from './utils/logger.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '..', 'package.json'), 'utf-8')
);

export async function runCLI(): Promise<void> {
  const program = new Command();

  program
    .name('create-techstack-app')
    .description('Interactive CLI to scaffold full-stack applications')
    .version(packageJson.version)
    .argument('[project-name]', 'Name of the project to create')
    .option('-y, --yes', 'Skip prompts and use defaults')
    .option('--frontend <type>', 'Frontend framework (react, vue, nextjs, vanilla)')
    .option('--backend <type>', 'Backend stack (express-mongodb, express-postgres, go-gin)')
    .action(async (projectName: string | undefined, options) => {
      try {
        console.log();
        logger.logo();
        console.log();

        const config: ProjectConfig = await promptUser(projectName, options);
        await generateProject(config);

        console.log();
        logger.success('🎉 Project created successfully!');
        console.log();
        logger.info(`Next steps:`);
        console.log();
        
        const projectDir = config.projectName === '.' ? '' : `  cd ${config.projectName}\n`;
        
        if (config.projectType === 'fullstack') {
          if (projectDir) logger.step(projectDir.trim());
          if (!config.installDeps) {
            logger.step(`  cd frontend && npm install`);
            logger.step(`  cd ../backend && npm install`);
          }
        } else {
          if (projectDir) logger.step(projectDir.trim());
          if (!config.installDeps) {
            logger.step(`  npm install`);
          }
        }
        
        logger.step(`  npm run dev`);
        console.log();
        logger.info('Happy coding! 🚀');
        console.log();
      } catch (error) {
        if (error instanceof Error) {
          logger.error(error.message);
        } else {
          logger.error('An unexpected error occurred');
        }
        process.exit(1);
      }
    });

  program.parse();
}
