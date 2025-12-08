import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
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

  let distances: { from: Point; to: Point; distance: number }[] = [];
  const equalPoints = (a: Point, b: Point) => {
    return a.x === b.x && a.y === b.y && a.z === b.z;
  };
  const addToCircuits = (newCircuit: {
    from: Point;
    to: Point;
    distance: number;
  }) => {
    let indFrom: number[] = [];
    let indTo: number[] = [];
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
        // theyre in teh same circuit already, so skip
        return;
      }
      // to is In a circuit, but from isnt
      if (fromIndex === -1 && toIndex >= 0) {
        indTo = [i, toIndex];
      }
      // from is in a circuit but to isnt
      if (toIndex === -1 && fromIndex >= 0) {
        indFrom = [i, fromIndex];
      }
    }
    if (indTo.length > 0 && indFrom.length === 0) {
      circuits[indTo[0]].push(newCircuit.from);
      return;
    }
    if (indFrom.length > 0 && indTo.length === 0) {
      circuits[indFrom[0]].push(newCircuit.to);
      return;
    }
    // if both are enpty
    // add new circuit
    if (indTo.length === 0 && indFrom.length === 0) {
      circuits.push([newCircuit.from, newCircuit.to]);
      return;
    }
    // if both have entries, merge circuits
    if (indTo.length > 0 && indFrom.length > 0) {
      circuits[indFrom[0]].push(...circuits[indTo[0]]);
      circuits.splice(indTo[0], 1);
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
  for (let i = 0; i < 1000; i++) {
    addToCircuits(distances[i]);
  }
  let orderedCircuits = circuits.sort((a, b) => b.length - a.length);
  console.log(
    `Part A: ${
      orderedCircuits[0].length *
      orderedCircuits[1].length *
      orderedCircuits[2].length
    }`
  );
}
