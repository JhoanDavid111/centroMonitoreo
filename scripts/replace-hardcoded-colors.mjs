#!/usr/bin/env node
/**
 * Reemplaza clases Tailwind con colores "quemados" por sus equivalentes del tema.
 *
 * Uso:
 *   node scripts/replace-hardcoded-colors.mjs
 *
 * Puede ejecutarse varias veces sin efectos adversos.
 */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const PROJECT_ROOT = path.resolve(process.cwd(), 'src');

/** Mapeo de patrones -> reemplazo */
const replacements = [
  // Fondos
  { pattern: /bg-\[#262626\]/g, replacement: 'bg-surface-primary' },
  { pattern: /bg-\[#1f1f1f\]/g, replacement: 'bg-surface-secondary' },
  { pattern: /bg-\[#1d1d1d\]/g, replacement: 'bg-[color:var(--surface-overlay)]' },
  { pattern: /bg-\[#111111\]/g, replacement: 'bg-[color:var(--surface-overlay)]' },
  { pattern: /bg-\[#333333\]/g, replacement: 'bg-[color:var(--surface-overlay)]' },

  // Bordes
  { pattern: /border-\[#666666\]/g, replacement: 'border-[color:var(--border-default)]' },
  { pattern: /border-\[#3a3a3a\]/g, replacement: 'border-[color:var(--border-subtle)]' },
  { pattern: /border-\[#1d1d1d\]/g, replacement: 'border-[color:var(--border-subtle)]' },

  // Texto
  { pattern: /text-\[#ffffff\]/g, replacement: 'text-text-primary' },
  { pattern: /text-\[#D1D1D0\]/g, replacement: 'text-text-secondary' },
  { pattern: /text-\[#B0B0B0\]/g, replacement: 'text-text-muted' },
  { pattern: /text-\[#FFC800\]/g, replacement: 'text-[color:var(--accent-primary)]' },
  { pattern: /text-\[#ef4444\]/gi, replacement: 'text-[color:var(--text-danger)]' },

  // Sombras o toques varios
  { pattern: /shadow(?:-lg)?/g, replacement: match => (match === 'shadow-lg' ? 'shadow-soft' : match) },
];

const exts = new Set(['.js', '.jsx', '.ts', '.tsx', '.css', '.html']);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (exts.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function processFile(file) {
  const original = await readFile(file, 'utf8');
  let updated = original;
  for (const { pattern, replacement } of replacements) {
    updated = updated.replace(pattern, replacement);
  }
  if (updated !== original) {
    await writeFile(file, updated, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  const dirStat = await stat(PROJECT_ROOT).catch(() => null);
  if (!dirStat?.isDirectory()) {
    console.error(`No se encontró el directorio src en ${PROJECT_ROOT}`);
    process.exit(1);
  }

  const files = await listFiles(PROJECT_ROOT);
  let changed = 0;
  for (const file of files) {
    const didChange = await processFile(file);
    if (didChange) {
      changed += 1;
      console.log(`Actualizado: ${path.relative(process.cwd(), file)}`);
    }
  }

  if (changed === 0) {
    console.log('No se encontraron coincidencias.');
  } else {
    console.log(`\nTotal de archivos modificados: ${changed}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

