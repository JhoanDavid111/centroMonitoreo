#!/usr/bin/env node
/**
 * Reemplaza estilos inline con tokens del tema.
 *
 * Uso:
 *   node scripts/replace-inline-styles.mjs
 *
 * Vuelve a ejecutar replace-hardcoded-colors.mjs si necesitas actualizar Tailwind classes.
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(process.cwd(), 'src');
const THEME_FILE = path.join(PROJECT_ROOT, 'styles', 'theme.js');
const CODE_EXTS = new Set(['.js', '.jsx', '.ts', '.tsx']);

const INLINE_REPLACEMENTS = [
  // backgroundColor / background
  { pattern: /backgroundColor:\s*['"]#262626['"]/gi, replacement: 'backgroundColor: tokens.colors.surface.primary', needsTokens: true },
  { pattern: /backgroundColor:\s*['"]#1f1f1f['"]/gi, replacement: 'backgroundColor: tokens.colors.surface.secondary', needsTokens: true },
  { pattern: /backgroundColor:\s*['"]#1d1d1d['"]/gi, replacement: 'backgroundColor: tokens.colors.surface.overlay', needsTokens: true },
  { pattern: /backgroundColor:\s*['"]#333333['"]/gi, replacement: 'backgroundColor: tokens.colors.surface.overlay', needsTokens: true },
  { pattern: /background:\s*['"]#262626['"]/gi, replacement: 'background: tokens.colors.surface.primary', needsTokens: true },
  { pattern: /background:\s*['"]#1f1f1f['"]/gi, replacement: 'background: tokens.colors.surface.secondary', needsTokens: true },

  // Borders
  { pattern: /borderColor:\s*['"]#666666['"]/gi, replacement: 'borderColor: tokens.colors.border.default', needsTokens: true },
  { pattern: /borderColor:\s*['"]#3a3a3a['"]/gi, replacement: 'borderColor: tokens.colors.border.subtle', needsTokens: true },
  { pattern: /borderColor:\s*['"]#262626['"]/gi, replacement: 'borderColor: tokens.colors.surface.primary', needsTokens: true },
  { pattern: /borderColor:\s*['"]#2e2e2e['"]/gi, replacement: 'borderColor: tokens.colors.border.subtle', needsTokens: true },
  { pattern: /plotBorderColor:\s*['"]#262626['"]/gi, replacement: 'plotBorderColor: tokens.colors.surface.primary', needsTokens: true },
  { pattern: /gridLineColor:\s*['"]#444['"]/gi, replacement: 'gridLineColor: tokens.colors.border.subtle', needsTokens: true },

  // Text color
  { pattern: /color:\s*['"]#fff(?:fff)?['"]/gi, replacement: 'color: tokens.colors.text.primary', needsTokens: true },
  { pattern: /color:\s*['"]#d1d1d0['"]/gi, replacement: 'color: tokens.colors.text.secondary', needsTokens: true },
  { pattern: /color:\s*['"]#b0b0b0['"]/gi, replacement: 'color: tokens.colors.text.muted', needsTokens: true },
  { pattern: /color:\s*['"]#cccccc['"]/gi, replacement: 'color: tokens.colors.text.secondary', needsTokens: true },
  { pattern: /color:\s*['"]#ffc800['"]/gi, replacement: 'color: tokens.colors.accent.primary', needsTokens: true },
  { pattern: /color:\s*['"]#ef4444['"]/gi, replacement: 'color: tokens.colors.status.negative', needsTokens: true },
  { pattern: /color:\s*['"]#22c55e['"]/gi, replacement: 'color: tokens.colors.status.positive', needsTokens: true },
  { pattern: /color:\s*['"]#f59e0b['"]/gi, replacement: 'color: tokens.colors.status.warning', needsTokens: true },
  { pattern: /color:\s*['"]#3b82f6['"]/gi, replacement: 'color: tokens.colors.status.info', needsTokens: true },

  // Series colors (common)
  { pattern: /color:\s*['"]#05d80a['"]/gi, replacement: 'color: tokens.colors.status.positive', needsTokens: true },
  { pattern: /color:\s*['"]#05D80A['"]/g, replacement: 'color: tokens.colors.status.positive', needsTokens: true },
  { pattern: /color:\s*['"]#228B22['"]/gi, replacement: 'color: tokens.colors.status.positive', needsTokens: true },

  // bar progress etc
  { pattern: /background:\s*['"]#3B82F6['"]/gi, replacement: 'background: tokens.colors.status.info', needsTokens: true },
  { pattern: /background:\s*['"]#22C55E['"]/gi, replacement: 'background: tokens.colors.status.positive', needsTokens: true },
  { pattern: /background:\s*['"]#EF4444['"]/gi, replacement: 'background: tokens.colors.status.negative', needsTokens: true },
  { pattern: /background:\s*['"]#F59E0B['"]/gi, replacement: 'background: tokens.colors.status.warning', needsTokens: true },
];

async function listCodeFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listCodeFiles(fullPath)));
    } else if (CODE_EXTS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function ensureImport(content, file, insertedTokens) {
  if (!insertedTokens) return content;
  if (/import\s+.*tokens\s+from\s+['"].+theme\.js['"]/.test(content)) {
    return content;
  }
  const relative = path.relative(path.dirname(file), THEME_FILE).replace(/\\/g, '/');
  const importPath = relative.startsWith('.') ? relative : `./${relative}`;
  const importStatement = `import tokens from '${importPath}';\n`;
  const lines = content.split('\n');
  let insertIndex = 0;
  while (insertIndex < lines.length && lines[insertIndex].startsWith('import ')) {
    insertIndex += 1;
  }
  lines.splice(insertIndex, 0, importStatement);
  return lines.join('\n');
}

async function processFile(file) {
  let content = await readFile(file, 'utf8');
  let updated = content;
  let usedTokens = false;

  INLINE_REPLACEMENTS.forEach(({ pattern, replacement, needsTokens }) => {
    if (pattern.test(content)) {
      pattern.lastIndex = 0; // reset lastIndex for global regex
      updated = updated.replace(pattern, replacement);
      if (needsTokens) usedTokens = true;
    }
  });

  if (updated !== content) {
    updated = ensureImport(updated, file, usedTokens);
    await writeFile(file, updated, 'utf8');
    console.log(`Actualizado: ${path.relative(process.cwd(), file)}`);
  }
}

async function main() {
  const dirStat = await stat(PROJECT_ROOT).catch(() => null);
  if (!dirStat?.isDirectory()) {
    console.error(`No se encontró el directorio src en ${PROJECT_ROOT}`);
    process.exit(1);
  }

  const files = await listCodeFiles(PROJECT_ROOT);
  for (const file of files) {
    await processFile(file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

