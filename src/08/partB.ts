import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partB(): void {
  type Point = { x: number; y: number; z: number };
  const input = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => {
      const [x, y, z] = line.split(",").map((num) => Number(num));
      return { x, y, z };
    });
  const euclideanDistance = (from: Point, to: Point): number => {
    return Math.sqrt(
      (from.x - to.x) ** 2 + (from.y - to.y) ** 2 + (from.z - to.z) ** 2
    );
  };

  let circuits: Point[][] = [];
  let smallestDistance: { from: Point; to: Point; distance: number } | null =
    null;
  let distances: { from: Point; to: Point; distance: number }[] = [];
  const equalPoints = (a: Point, b: Point) => {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  };
  const addToCircuits = (newCircuit: {
    from: Point;
    to: Point;
    distance: number;
  }) => {
    let indFrom: number | null = null;
    let indTo: number | null = null;
    if (circuits.length === 0) {
      circuits.push([newCircuit.from, newCircuit.to]);
      return;
    }
    for (let i = 0; i < circuits.length; i++) {
      const fromIndex = circuits[i].findIndex((point) =>
        equalPoints(point, newCircuit.from)
      );
      const toIndex = circuits[i].findIndex((point) =>
        equalPoints(point, newCircuit.to)
      );
      if (fromIndex >= 0 && toIndex >= 0) {
        // theyre in the same circuit already, so skip
        return;
      }
      if (fromIndex === -1 && toIndex >= 0) {
        indTo = i;
      }

      if (toIndex === -1 && fromIndex >= 0) {
        indFrom = i;
      }
    }
    if (indTo !== null && indFrom === null) {
      circuits[indTo].push(newCircuit.from);
      return;
    }
    if (indFrom !== null && indTo === null) {
      circuits[indFrom].push(newCircuit.to);
      return;
    }
    // if both are enpty
    // add new circuit
    if (indTo === null && indFrom === null) {
      circuits.push([newCircuit.from, newCircuit.to]);
      return;
    }
    // if both have entries, merge circuits
    if (indTo !== null && indFrom !== null) {
      circuits[indFrom].push(...circuits[indTo]);
      circuits.splice(indTo, 1);
    }
  };

  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      distances.push({
        from: input[i],
        to: input[j],
        distance: euclideanDistance(input[i], input[j]),
      });
    }
  }
  distances = distances.sort((a, b) => a.distance - b.distance);

  for (let i = 0; i < distances.length; i++) {
    addToCircuits(distances[i]);
    if (circuits.length === 1 && circuits[0].length === input.length) {
      console.log(`Part B: ${distances[i].from.x * distances[i].to.x}`);
      return;
    }
  }
}
