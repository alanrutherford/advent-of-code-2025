#!/usr/bin/env tsx

import { execSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface DayResult {
  day: string;
  partA: {
    result: string;
    time: number;
  } | null;
  partB: {
    result: string;
    time: number;
  } | null;
  totalTime: number;
  error?: string;
}

interface PartResult {
  result: string;
  time: number;
}

function formatTime(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(2)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function runDayPart(dayPath: string, part: 'A' | 'B'): PartResult | null {
  const partFile = join(dayPath, `part${part}.ts`);
  if (!existsSync(partFile)) {
    return null;
  }

  try {
    const start = performance.now();
    // Create a temporary script that imports and runs the part function
    const tempScript = `
      import partFunction from '${partFile}';
      partFunction();
    `;
    const output = execSync(`tsx -e "${tempScript}"`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout per part
    });
    const end = performance.now();

    return {
      result: output.trim(),
      time: end - start
    };
  } catch (error) {
    return {
      result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      time: 0
    };
  }
}

function runDayIndex(dayPath: string): PartResult | null {
  const indexFile = join(dayPath, 'index.ts');
  if (!existsSync(indexFile)) {
    return null;
  }

  try {
    const start = performance.now();
    const output = execSync(`tsx "${indexFile}"`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      timeout: 30000, // 30 second timeout
    });
    const end = performance.now();

    return {
      result: output.trim(),
      time: end - start
    };
  } catch (error) {
    return {
      result: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      time: 0
    };
  }
}

function runDay(dayNum: string): DayResult {
  const dayPath = join(process.cwd(), 'src', dayNum);

  if (!existsSync(dayPath)) {
    return {
      day: dayNum,
      partA: null,
      partB: null,
      totalTime: 0,
      error: 'Day directory not found'
    };
  }

  console.log(`\n🎄 Running Day ${dayNum}...`);

  const dayStart = performance.now();

  // Check if this day uses separate part files or combined index file
  const partAFile = join(dayPath, 'partA.ts');
  const partBFile = join(dayPath, 'partB.ts');
  const indexFile = join(dayPath, 'index.ts');

  let partA: PartResult | null = null;
  let partB: PartResult | null = null;

  if (existsSync(partAFile) || existsSync(partBFile)) {
    // Use separate part files
    partA = runDayPart(dayPath, 'A');
    partB = runDayPart(dayPath, 'B');
  } else if (existsSync(indexFile)) {
    // Use combined index file - both parts run together
    const indexResult = runDayIndex(dayPath);
    if (indexResult) {
      // Parse the combined output to extract both parts
      const output = indexResult.result;
      const partAMatch = output.match(/Part A:\s*(.+?)(?=\n|Part B|$)/);
      const partBMatch = output.match(/Part B:\s*(.+?)(?=\n|Day \d+|$)/);

      if (partAMatch) {
        partA = {
          result: `Part A: ${partAMatch[1].trim()}`,
          time: indexResult.time / 2 // Rough estimate - split time between parts
        };
      }

      if (partBMatch) {
        partB = {
          result: `Part B: ${partBMatch[1].trim()}`,
          time: indexResult.time / 2 // Rough estimate - split time between parts
        };
      }

      // If no parts were parsed but we have output, treat it as combined
      if (!partA && !partB && output) {
        partA = {
          result: output,
          time: indexResult.time
        };
      }
    }
  }

  const dayEnd = performance.now();

  return {
    day: dayNum,
    partA,
    partB,
    totalTime: dayEnd - dayStart
  };
}

function getAllDays(): string[] {
  const srcPath = join(process.cwd(), 'src');
  if (!existsSync(srcPath)) {
    return [];
  }

  return readdirSync(srcPath)
    .filter(name => /^\d{2}$/.test(name))
    .sort();
}

function printResults(results: DayResult[]) {
  console.log('\n' + '='.repeat(80));
  console.log('🎅 ADVENT OF CODE 2025 - RESULTS SUMMARY 🎅');
  console.log('='.repeat(80));

  let totalTime = 0;
  let completedParts = 0;
  let totalParts = 0;

  results.forEach(result => {
    totalTime += result.totalTime;

    console.log(`\nDay ${result.day}:`);

    if (result.error) {
      console.log(`  ❌ ${result.error}`);
      return;
    }

    if (result.partA) {
      totalParts++;
      if (!result.partA.result.includes('Error:')) {
        completedParts++;
        console.log(`  ⭐ Part A: ${result.partA.result} (${formatTime(result.partA.time)})`);
      } else {
        console.log(`  ❌ Part A: ${result.partA.result}`);
      }
    }

    if (result.partB) {
      totalParts++;
      if (!result.partB.result.includes('Error:')) {
        completedParts++;
        console.log(`  ⭐ Part B: ${result.partB.result} (${formatTime(result.partB.time)})`);
      } else {
        console.log(`  ❌ Part B: ${result.partB.result}`);
      }
    }

    if (result.partA || result.partB) {
      console.log(`  🕐 Total: ${formatTime(result.totalTime)}`);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL STATISTICS:');
  console.log(`  Stars collected: ${completedParts}/${totalParts} ⭐`);
  console.log(`  Total execution time: ${formatTime(totalTime)} 🕐`);

  if (completedParts > 0) {
    console.log(`  Average time per part: ${formatTime(totalTime / completedParts)} ⚡`);
  }

  console.log('='.repeat(80));
}

async function main() {
  const args = process.argv.slice(2);
  let daysToRun: string[];

  if (args.length === 0) {
    // Run all available days
    daysToRun = getAllDays();
    console.log('🎄 Running all available days...');
  } else if (args[0] === '--help' || args[0] === '-h') {
    console.log(`
🎄 Advent of Code Runner

Usage:
  npm run runner              # Run all days
  npm run runner 01 02 05     # Run specific days
  npm run runner --help       # Show this help

Examples:
  npm run runner              # Run all available days
  npm run runner 01           # Run only day 01
  npm run runner 01 02 03     # Run days 1, 2, and 3
`);
    return;
  } else {
    // Run specific days
    daysToRun = args.map(day => day.padStart(2, '0'));
    console.log(`🎄 Running days: ${daysToRun.join(', ')}`);
  }

  if (daysToRun.length === 0) {
    console.log('❌ No days found to run. Make sure you have day folders in src/ (01, 02, etc.)');
    return;
  }

  const results: DayResult[] = [];
  const overallStart = performance.now();

  for (const day of daysToRun) {
    const result = runDay(day);
    results.push(result);
  }

  const overallEnd = performance.now();

  printResults(results);
  console.log(`\n🎉 Completed in ${formatTime(overallEnd - overallStart)}`);
}

if (require.main === module) {
  main().catch(console.error);
}