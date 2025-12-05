import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partB(): void {
  const [rangesInput, ingredientsInput] =
    syncReadFile("./input.txt").split("\n\n");
  const ranges = rangesInput
    .split("\n")
    .map((line) => line.split("-").map((num) => parseInt(num)));
  const ingredients = ingredientsInput
    .split("\n")
    .map((line) => parseInt(line));
  const simplify = (ranges: number[][]) => {
    const freshRanges: number[][] = [];
    for (const range of ranges) {
      let mutated = false;
      for (const freshRange of freshRanges) {
        //range is larger than fresh range
        if (range[0] <= freshRange[0] && range[1] >= freshRange[1]) {
          freshRange[0] = range[0];
          freshRange[1] = range[1];
          mutated = true;
          break;
        }
        //range is smaller than fresh range
        if (range[0] >= freshRange[0] && range[1] <= freshRange[1]) {
          mutated = true;
          break;
        }
        // if range is overlapping, finishing later
        if (range[0] >= freshRange[0] && range[0] <= freshRange[1]) {
          if (range[1] > freshRange[1]) {
            freshRange[1] = range[1];
            mutated = true;
            break;
          }
        }
        // if range is overlapping starting earlier
        if (range[1] >= freshRange[0] && range[0] < freshRange[0]) {
          freshRange[0] = range[0];
          mutated = true;
          break;
        }
      }
      if (!mutated) {
        freshRanges.push(range);
      }
    }
    return freshRanges;
  };
  let isDifferent = true;
  let fresherRanges: number[][] = ranges;
  while (isDifferent) {
    const newRanges = simplify(fresherRanges);
    if (fresherRanges.flat().toString() === newRanges.flat().toString()) {
      isDifferent = false;
    } else {
      fresherRanges = newRanges;
    }
  }
  console.log(
    `Part B: ${fresherRanges
      .map((elem) => elem[1] - elem[0] + 1)
      .reduce((a, b) => a + b)}`
  );
}
