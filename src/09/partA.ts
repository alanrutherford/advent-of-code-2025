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
      const [x, y] = line.split(",").map((num) => Number(num));
      return { x, y };
    });
  let lergest = 0;
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = 1; j < input.length; j++) {
      const size =
        (Math.abs(input[i].x - input[j].x) + 1) *
        (Math.abs(input[i].y - input[j].y) + 1);
      if (size > lergest) {
        lergest = size;
      }
    }
  }
  console.log(`Part A: ${lergest}`);
}
