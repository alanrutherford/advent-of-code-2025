import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partB(): void {
  const input = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => line.split(""));
  let start = [];
  for (let i = 0; i < input[0].length; i++) {
    if (input[0][i] === "S") {
      start.push(0, i);
    }
  }

  const lines: { position: number; times: number }[][] = [];
  lines.push([{ position: start[1], times: 1 }]);

  for (let i = 1; i < input.length; i++) {
    let newLinesRaw: Record<number, number> = {};
    for (const line of lines[i - 1]) {
      if (input[i][line.position] === ".") {
        if (newLinesRaw[line.position] !== undefined) {
          newLinesRaw[line.position] += line.times;
        } else {
          newLinesRaw[line.position] = line.times;
        }
      }
      if (input[i][line.position] === "^") {
        if (newLinesRaw[line.position - 1]) {
          newLinesRaw[line.position - 1] += line.times;
        } else {
          newLinesRaw[line.position - 1] = line.times;
        }
        if (newLinesRaw[line.position + 1]) {
          newLinesRaw[line.position + 1] += line.times;
        } else {
          newLinesRaw[line.position + 1] = line.times;
        }
      }
    }

    const newLines: { position: number; times: number }[] = [];
    for (const [key, value] of Object.entries(newLinesRaw)) {
      newLines.push({
        position: Number(key),
        times: value,
      });
    }
    lines.push(newLines);
  }

  console.log(
    `Part B: ${lines[lines.length - 1]
      .map((elem) => elem.times)
      .reduce((a, b) => a + b)}`
  );
}
