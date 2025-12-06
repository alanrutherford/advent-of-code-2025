import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partB(): void {
  const input = syncReadFile("./input.txt").split("\n");
  const ops = syncReadFile("./input.txt")
    .split("\n")
    .pop()
    ?.trim()
    .split(/\s+/)
    .reverse();
  if (!ops) {
    throw "Something went very wrong";
  }
  let total = 0;
  let nums: number[] = [];
  for (let i = 0; i <= input[0].length; i++) {
    const num: string[] = [];
    for (let j = 0; j < input.length - 1; j++) {
      num.push(input[j].charAt(i));
    }
    if (num.every((char) => char === " " || i === input[0].length)) {
      const currentOp = ops.pop();
      if (currentOp === "*") {
        total += nums.reduce((a, b) => a * b);
      } else {
        total += nums.reduce((a, b) => a + b);
      }
      nums = [];
    } else {
      nums.push(parseInt(num.join("")));
    }
  }
  console.log(`Part B:${total}`);
}
