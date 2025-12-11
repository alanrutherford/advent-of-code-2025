import { readFileSync } from "fs";
import { join } from "path";

export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}
export default function partB(): void {
  const machines: Record<string, string[]> = {};
  const cache: Record<string, number> = {};
  syncReadFile("./input.txt")
    .split("\n")
    .forEach((line) => {
      const [machine, outRaw] = line.split(":");
      const outputs = outRaw.trimStart().split(" ");
      machines[machine] = outputs;
    });

  const search = (start: string, end: string, path: string[]) => {
    let count = 0;
    if (start === end && path.includes("fft") && path.includes("dac")) {
      return 1;
    } else if (machines[start]) {
      for (const newStart of machines[start]) {
        const key = JSON.stringify({
          newStart,
          end,
          fft: path.includes("fft"),
          dac: path.includes("dac"),
        });
        if (cache[key] !== undefined) {
          count += cache[key];
        } else {
          const newPath = [...path, newStart];
          cache[key] = search(newStart, end, newPath);
          count += cache[key];
        }
      }
    }
    return count;
  };
  let sum = search("svr", "out", []);
  console.log(`Part B: ${sum}`);
}
