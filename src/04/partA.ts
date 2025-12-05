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

  const checkLocation = (X: number, Y: number) => {
    let papersNearby = 0;
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
          papersNearby++;
        }
      }
    }
    return papersNearby;
  };
  let count = 0;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === "@" && checkLocation(x, y) < 4) {
        count++;
      }
    }
  }
  console.log(`Part A:${count}`);
}
