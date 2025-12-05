import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const [rangesInput, ingredientsInput] =
    syncReadFile("./input.txt").split("\n\n");
  const ranges = rangesInput
    .split("\n")
    .map((line) => line.split("-").map((num) => parseInt(num)));
  const ingredients = ingredientsInput
    .split("\n")
    .map((line) => parseInt(line));

  let count = 0;

  for (const ingredient of ingredients) {
    for (const range of ranges) {
      if (ingredient >= range[0] && ingredient <= range[1]) {
        count++;
        break;
      }
    }
  }
  console.log(`Part A: ${count}`);
}
