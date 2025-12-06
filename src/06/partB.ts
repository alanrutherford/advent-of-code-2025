import assert from "assert";
import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partB(): void {
  const ops = syncReadFile("./input.txt")
    .split("\n")
    .pop()
    ?.trim()
    .split(/\s+/);

  const numOfDigits: number[] = [];
  let thing = syncReadFile("./input.txt").split("\n").pop()?.split("");
  assert(thing);
  for (let i = 0; i <= thing.length; i++) {
    if (thing[i + 1] !== " ") {
      numOfDigits.push(i);
    }
  }
  const problems = syncReadFile("./input.txt")
    .split("\n")
    .map((elem) => elem.split(""));

  const finalProblems: string[][] = [];
  for (let j = 0; j < problems.length - 1; j++) {
    for (let k = 0; k < numOfDigits.length - 2; k++) {
      problems[j][numOfDigits[k]] = "-";
    }
    finalProblems.push(problems[j].join("").replace(/ /g, "*").split("-"));
  }

  assert(ops);
  const matrix: string[][][] = [];
  for (let j = 0; j < finalProblems[0].length; j++) {
    let nums: string[] = [];
    for (let i = 0; i < finalProblems.length; i++) {
      nums.push(finalProblems[i][j]);
    }

    matrix.push(nums.map((elm) => elm.split("")));
  }
  let runningTotal = 0;
  for (let i = 0; i < matrix.length; i++) {
    const nums: number[] = [];
    for (let j = 0; j < matrix[i][0].length; j++) {
      let num = "";
      for (let k = 0; k < matrix[i].length; k++) {
        if (matrix[i][k][j] !== "*") {
          num += matrix[i][k][j];
        }
      }
      nums.push(parseInt(num));
    }
    if (ops[i] === "*") {
      runningTotal += nums.reduce((a, b) => a * b);
    } else {
      runningTotal += nums.reduce((a, b) => a + b);
    }
  }
  console.log(`Part B: ${runningTotal}`);
}
