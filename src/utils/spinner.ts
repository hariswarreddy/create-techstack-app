import ora, { type Ora } from 'ora';

export function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
    spinner: 'dots',
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
