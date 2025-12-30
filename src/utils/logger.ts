import chalk from 'chalk';

const LOGO = `
  create-techstack-app
`;

export const logger = {
  logo: () => {
    console.log(chalk.cyan(LOGO));
  },

  success: (message: string) => {
    console.log(chalk.green.bold(message));
  },

  error: (message: string) => {
    console.log(chalk.red.bold(`✖ ${message}`));
  },

  warning: (message: string) => {
    console.log(chalk.yellow(`⚠ ${message}`));
  },

  info: (message: string) => {
    console.log(chalk.blue(message));
  },

  step: (message: string) => {
    console.log(chalk.gray(message));
  },

  highlight: (message: string) => {
    console.log(chalk.magenta.bold(message));
  },

  dim: (message: string) => {
    console.log(chalk.dim(message));
  },
};
