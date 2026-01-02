import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface NpmRegistryResponse {
  'dist-tags': {
    latest: string;
  };
}

/**
 * Check for updates from npm registry
 * Returns update message if newer version available, null otherwise
 */
export async function checkForUpdates(): Promise<string | null> {
  try {
    // Read current version from package.json
    const packageJson = JSON.parse(
      readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf-8')
    );
    const currentVersion = packageJson.version;
    const packageName = packageJson.name;

    // Fetch latest version from npm registry (with 3s timeout)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `https://registry.npmjs.org/${packageName}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as NpmRegistryResponse;
    const latestVersion = data['dist-tags'].latest;

    // Compare versions
    if (isNewerVersion(latestVersion, currentVersion)) {
      return formatUpdateMessage(currentVersion, latestVersion, packageName);
    }

    return null;
  } catch {
    // Silently fail - don't interrupt user workflow for update check failures
    return null;
  }
}

/**
 * Compare two semver versions
 * Returns true if latest is newer than current
 */
function isNewerVersion(latest: string, current: string): boolean {
  const latestParts = latest.split('.').map(Number);
  const currentParts = current.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const latestPart = latestParts[i] || 0;
    const currentPart = currentParts[i] || 0;

    if (latestPart > currentPart) return true;
    if (latestPart < currentPart) return false;
  }

  return false;
}

/**
 * Format the update notification message
 */
function formatUpdateMessage(current: string, latest: string, packageName: string): string {
  const boxWidth = 50;
  const line = '─'.repeat(boxWidth);
  
  return `
${chalk.yellow('┌' + line + '┐')}
${chalk.yellow('│')} ${chalk.bold('🔔 Update available!')}${' '.repeat(boxWidth - 21)}${chalk.yellow('│')}
${chalk.yellow('│')}${' '.repeat(boxWidth)}${chalk.yellow('│')}
${chalk.yellow('│')} ${chalk.gray(current)} → ${chalk.green.bold(latest)}${' '.repeat(boxWidth - current.length - latest.length - 6)}${chalk.yellow('│')}
${chalk.yellow('│')}${' '.repeat(boxWidth)}${chalk.yellow('│')}
${chalk.yellow('│')} Run: ${chalk.cyan(`npm update -g ${packageName}`)}${' '.repeat(boxWidth - packageName.length - 22)}${chalk.yellow('│')}
${chalk.yellow('└' + line + '┘')}`;
}
