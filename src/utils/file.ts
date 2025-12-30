import { existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';

export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function copyDir(src: string, dest: string, replacements?: Record<string, string>): void {
  ensureDir(dest);

  const entries = readdirSync(src);

  for (const entry of entries) {
    const srcPath = join(src, entry);
    const destPath = join(dest, entry);
    const stat = statSync(srcPath);

    if (stat.isDirectory()) {
      copyDir(srcPath, destPath, replacements);
    } else {
      copyFile(srcPath, destPath, replacements);
    }
  }
}

export function copyFile(
  src: string,
  dest: string,
  replacements?: Record<string, string>
): void {
  ensureDir(dirname(dest));

  if (replacements) {
    let content = readFileSync(src, 'utf-8');
    
    for (const [key, value] of Object.entries(replacements)) {
      content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    
    writeFileSync(dest, content);
  } else {
    copyFileSync(src, dest);
  }
}

export function directoryExists(path: string): boolean {
  return existsSync(path);
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function writeJson(path: string, data: object): void {
  ensureDir(dirname(path));
  writeFileSync(path, JSON.stringify(data, null, 2));
}

export function readJson<T>(path: string): T {
  const content = readFileSync(path, 'utf-8');
  return JSON.parse(content);
}
