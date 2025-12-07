import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const input = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => line.split(""));
  let start = [];
  for (let i = 0; i < input[0].length; i++) {
    if (input[0][i] === "S") {
      start.push(0, i);
    }
  }
  const lines: number[][] = [[start[1]]];
  let splitted = 0;
  for (let i = 1; i < input.length; i++) {
    // const lines: number[] = [];
    const newLines: number[] = [];
    for (const line of lines[i - 1]) {
      if (input[i][line] === ".") {
        newLines.push(line);
      }
      if (input[i][line] === "^") {
        splitted++;
        newLines.push(line - 1);
        newLines.push(line + 1);
      }
    }
    lines.push(Array.from(new Set(newLines)));
  }

  console.log(`Part A: ${splitted}`);
}
