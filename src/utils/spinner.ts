import ora, { type Ora } from 'ora';

const SPINNER_FRAMES = ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'];

export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
    spinner: {
      interval: 80,
      frames: SPINNER_FRAMES,
    },
  });
}

export async function withSpinner<T>(
  text: string,
  action: () => Promise<T>,
  successText?: string,
  errorText?: string
): Promise<T> {
  const spinner = createSpinner(text);
  spinner.start();

  try {
    const result = await action();
    spinner.succeed(successText || text);
    return result;
  } catch (error) {
    spinner.fail(errorText || `Failed: ${text}`);
    throw error;
  }
}

// Progress bar for multi-step operations
export class ProgressTracker {
  private spinner: Ora;
  private currentStep = 0;
  private totalSteps: number;
  private steps: string[];

  constructor(steps: string[]) {
    this.steps = steps;
    this.totalSteps = steps.length;
    this.spinner = ora({
      color: 'cyan',
      spinner: {
        interval: 80,
        frames: SPINNER_FRAMES,
      },
    });
  }

  start(): void {
    this.updateText();
    this.spinner.start();
  }

  private updateText(): void {
    const percentage = Math.round((this.currentStep / this.totalSteps) * 100);
    const progressBar = this.createProgressBar(percentage);
    const stepText = this.currentStep < this.totalSteps 
      ? this.steps[this.currentStep] 
      : 'Finishing up...';
    this.spinner.text = `${progressBar} ${percentage}% - ${stepText}`;
  }

  private createProgressBar(percentage: number): string {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    const filledBar = '█'.repeat(filled);
    const emptyBar = '░'.repeat(empty);
    return `[${filledBar}${emptyBar}]`;
  }

  nextStep(successMessage?: string): void {
    if (successMessage) {
      this.spinner.stopAndPersist({
        symbol: '✓',
        text: successMessage,
      });
    }
    this.currentStep++;
    if (this.currentStep < this.totalSteps) {
      this.updateText();
      this.spinner.start();
    }
  }

  complete(message: string): void {
    this.spinner.succeed(`[████████████████████] 100% - ${message}`);
  }

  fail(message: string): void {
    this.spinner.fail(message);
  }
}

// Helper to run with progress tracking
export async function withProgress<T>(
  steps: { name: string; action: () => Promise<unknown> }[],
  finalMessage: string
): Promise<void> {
  const stepNames = steps.map(s => s.name);
  const progress = new ProgressTracker(stepNames);
  progress.start();

  try {
    for (let i = 0; i < steps.length; i++) {
      await steps[i].action();
      progress.nextStep(`✓ ${steps[i].name}`);
    }
    progress.complete(finalMessage);
  } catch (error) {
    progress.fail(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}
