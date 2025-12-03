import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}
export default function partB(): void {
  const banks = syncReadFile("./input.txt").split("\n");
  const numOfDigits = 12;
  const maxJolts = [];
  for (const bank of banks) {
    let maxJolt = "";
    let offset = 0;
    while (maxJolt.length != numOfDigits) {
      const choices = bank
        .slice(offset, bank.length - numOfDigits + maxJolt.length + 1)
        .split("")
        .map((num) => parseInt(num));
      const chosenDig = Math.max(...choices);
      offset += choices.indexOf(chosenDig) + 1;
      maxJolt += chosenDig;
    }
    maxJolts.push(maxJolt);
  }
  console.log(
    `Part B: ${maxJolts.map((jolt) => parseInt(jolt)).reduce((a, b) => a + b)}`
  );
}
