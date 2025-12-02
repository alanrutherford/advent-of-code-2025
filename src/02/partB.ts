import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partB(): void {
  const input = syncReadFile("./input.txt")
    .split(",")
    .map((code) => {
      return code.split("-").map((num) => parseInt(num));
    });
  let sum = 0;
  const checkInvalid = (num: number) => {
    const strNum = num.toString();
    for (let i = 2; i <= strNum.length; i++) {
      if (strNum.length % i) {
        continue;
      }
      const nums = new Set<string>();
      for (let j = 0; j < i; j++) {
        nums.add(
          strNum.slice(j * (strNum.length / i), (j + 1) * (strNum.length / i))
        );
      }
      if (nums.size === 1) {
        return true;
      }
    }
    return false;
  };

  for (const code of input) {
    for (let i = code[0]; i <= code[1]; i++) {
      if (checkInvalid(i)) {
        sum += i;
      }
    }
  }
  console.log(`Part B: ${sum}`);
}
