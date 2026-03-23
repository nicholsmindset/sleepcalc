#!/usr/bin/env tsx
/**
 * Generate TypeScript types from Supabase schema.
 *
 * Usage:
 *   npx tsx scripts/generate-types.ts
 *
 * Requires either:
 *   - SUPABASE_PROJECT_ID env var (for remote Supabase project)
 *   - Local Supabase CLI running (supabase start)
 *
 * Output: src/lib/supabase/types.ts
 */
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const OUTPUT_PATH = resolve(__dirname, '../src/lib/supabase/types.ts');
const projectId = process.env.SUPABASE_PROJECT_ID;

// Ensure output directory exists
const outputDir = dirname(OUTPUT_PATH);
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

function generateFromRemote(id: string): void {
  console.log(`Generating types from remote project: ${id}`);
  execSync(
    `npx supabase gen types typescript --project-id=${id} > "${OUTPUT_PATH}"`,
    { stdio: 'inherit' }
  );
}

function generateFromLocal(): void {
  console.log('Generating types from local Supabase instance...');
  execSync(
    `npx supabase gen types typescript --local > "${OUTPUT_PATH}"`,
    { stdio: 'inherit' }
  );
}

function isLocalSupabaseRunning(): boolean {
  try {
    execSync('npx supabase status', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Main
try {
  if (projectId) {
    generateFromRemote(projectId);
  } else if (isLocalSupabaseRunning()) {
    generateFromLocal();
  } else {
    console.log('No SUPABASE_PROJECT_ID set and local Supabase is not running.');
    console.log('');
    console.log('Options:');
    console.log('  1. Set SUPABASE_PROJECT_ID env var for remote type generation');
    console.log('  2. Run "supabase start" for local type generation');
    console.log('  3. Use the manual types in src/lib/supabase/types.ts');
    process.exit(0);
  }

  console.log(`Types generated successfully at: ${OUTPUT_PATH}`);
} catch (error) {
  console.error('Failed to generate types:', error);
  process.exit(1);
}
