import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  const shapes: { area: number; outline: string[][] }[] = [];
  const spaces: {
    width: number;
    height: number;
    shapeNums: number[];
  }[] = [];
  syncReadFile("./input.txt")
    .split("\n\n")
    .forEach((piece, index) => {
      if (index < 6) {
        shapes.push({
          area: piece.split("").filter((elem) => elem === "#").length,
          outline: piece
            .split("\n")
            .slice(1)
            .map((line) => line.split("")),
        });
      } else {
        const lines = piece.split("\n");
        for (const line of lines) {
          const [areaRaw, counts] = line.split(":");
          const [width, height] = areaRaw.split("x").map(Number);
          spaces.push({
            height,
            width,
            shapeNums: counts.trimStart().split(" ").map(Number),
          });
        }
      }
    });
  let count = 0;
  for (const space of spaces) {
    let shapeAreas = 0;
    const spaceArea = space.height * space.width;
    for (let i = 0; i < shapes.length; i++) {
      shapeAreas += shapes[i].area * space.shapeNums[i];
    }
    if (spaceArea >= shapeAreas) {
      count++;
    }
  }
  console.log(`Part A: ${count}`);
}
