import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const input = syncReadFile("./input.txt")
    .split(",")
    .map((code) => {
      return code.split("-").map((num) => parseInt(num));
    });
  let sum = 0;
  const checkInvalid = (num: number) => {
    const strNum = num.toString();
    if (strNum.length % 2) {
      return false;
    }
    const firstHalf = strNum.slice(0, strNum.length / 2);
    const end = strNum.slice(strNum.length / 2);
    return firstHalf === end;
  };
  for (const code of input) {
    for (let i = code[0]; i <= code[1]; i++) {
      if (checkInvalid(i)) {
        sum += i;
      }
    }
  }

  console.log(`Part A: ${sum}`);
}
