import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const input = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => {
      if (line.includes("R")) {
        return Number.parseInt(line.slice(1));
      } else return -Number.parseInt(line.slice(1));
    });
  let count = 0;
  let point = 50;
  for (const movement of input) {
    point += movement % 100;

    if (point < 0) {
      point += 100;
    }
    if (point > 99) {
      point -= 100;
    }
    if (point === 0) {
      count++;
    }
  }
  console.log(`Part A: ${count}`);
}
