import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const input = syncReadFile("./input.txt").split("\n");
  let voltages: number[] = [];
  let highestSoFar = 0;
  for (const bank of input) {
    for (let i = 0; i < bank.length - 1; i++) {
      for (let j = i + 1; j < bank.length; j++) {
        const newVal = parseInt(bank.charAt(i)) * 10 + parseInt(bank.charAt(j));
        if (newVal > highestSoFar) {
          highestSoFar = newVal;
        }
      }
    }
    voltages.push(highestSoFar);
    highestSoFar = 0;
  }
  console.log(`Part A: ${voltages.reduce((a, b) => a + b)}`);
}
