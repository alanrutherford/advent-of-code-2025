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

  const checkLocation = (X: number, Y: number) => {
    let papersNearby: number[][] = [];
    let count = 0;
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        if (
          (x === 0 && y == 0) ||
          X + x < 0 ||
          Y + y < 0 ||
          X + x >= input[0].length ||
          Y + y >= input.length
        ) {
          continue;
        }
        if (input[Y + y][X + x] === "@") {
          papersNearby.push([Y + y, X + x]);
          count++;
        }
      }
    }
    return papersNearby;
  };
  const printOut = () => {
    for (let y = 0; y < input.length; y++) {
      console.log(input[y].join(""));
    }
  };
  const writeOver = (removedPapers: number[][]) => {
    for (const removedPaper of removedPapers) {
      input[removedPaper[0]][removedPaper[1]] = ".";
    }
  };
  let count: number[][] = [];
  let change = true;
  while (change) {
    const original = count.length;
    let newPapers: number[][] = [];
    for (let y = 0; y < input.length; y++) {
      for (let x = 0; x < input[0].length; x++) {
        if (input[y][x] === "@") {
          const thing = checkLocation(x, y);
          if (thing.length < 4) {
            newPapers.push([y, x]);
          }
        }
      }
    }
    writeOver(newPapers);
    count.push(...newPapers);
    newPapers = [];
    if (count.length === original) {
      change = false;
    }
  }
  console.log(`Part B:${count.length}`);
}
