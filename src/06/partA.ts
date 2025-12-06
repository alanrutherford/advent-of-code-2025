import assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const ops = syncReadFile("./input.txt")
    .split("\n")
    .pop()
    ?.trim()
    .split(/\s+/);
  assert(ops);
  const problems = syncReadFile("./input.txt")
    .split("\n")
    .map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((elem) => parseInt(elem))
    );
  let total = 0;
  for (let j = 0; j < problems[0].length; j++) {
    let running = problems[0][j];
    for (let i = 1; i < problems.length - 1; i++) {
      if (ops[j] === "+") {
        running += problems[i][j];
      } else {
        running *= problems[i][j];
      }
    }
    total += running;
  }
  // console.log(problems);
  // console.log(ops);
  console.log(`Part A: ${total}`);
}
