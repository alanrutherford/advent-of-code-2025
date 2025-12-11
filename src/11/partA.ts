import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const machines: Record<string, string[]> = {};
  syncReadFile("./input.txt")
    .split("\n")
    .forEach((line) => {
      const [machine, outRaw] = line.split(":");
      const outputs = outRaw.trimStart().split(" ");
      machines[machine] = outputs;
    });
  let count = 0;
  const search = (start: string, end: string, path: string) => {
    if (start === end) {
      count++;
    } else {
      for (const newStart of machines[start]) {
        search(newStart, end, path + newStart);
      }
    }
  };
  search("you", "out", "");
  console.log(`Part A: ${count}`);
}
