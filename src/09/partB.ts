import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}
type Point = { x: number; y: number };
export default function partC(): void {
  const input = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => {
      const [x, y] = line.split(",").map((num) => Number(num));
      return { x, y };
    });

  const isPointOnSegment = (p: Point, a: Point, b: Point): boolean => {
    const crossProduct = (p.y - a.y) * (b.x - a.x) - (p.x - a.x) * (b.y - a.y);
    if (Math.abs(crossProduct) > 0) {
      return false;
    }

    const dotProduct = (p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y);
    if (dotProduct < 0) {
      return false;
    }

    const squaredLengthBA =
      (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);
    if (dotProduct > squaredLengthBA) {
      return false;
    }

    return true;
  };

  const isPointInPolygon = (point: Point, polygon: Point[]): boolean => {
    let inside = false;
    const numVertices = polygon.length;

    for (let i = 0, j = numVertices - 1; i < numVertices; j = i++) {
      const p1 = polygon[i];
      const p2 = polygon[j];

      // Check if point is on an edge (optional, but good for "including edges")
      if (isPointOnSegment(point, p1, p2)) {
        return true;
      }

      // Ray casting algorithm
      const intersect =
        p1.y > point.y !== p2.y > point.y &&
        point.x < ((p2.x - p1.x) * (point.y - p1.y)) / (p2.y - p1.y) + p1.x;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  };

  let largest = 0;
  // treat points as a polygon
  // for each rectangle,
  //  calculate area, if area is smaller than current biggest, return early
  //  determine if each tile is within the polygon
  //  if rectangle area is larger, add it in

  const checkAllPoints = (A: Point, B: Point) => {
    let exes = [A.x, B.x].sort((a, b) => a - b);
    let eyes = [A.y, B.y].sort((a, b) => a - b);
    for (const x of exes) {
      for (let y = Math.min(...eyes); y <= Math.max(...eyes); y += 100) {
        if (!isPointInPolygon({ x, y }, input)) {
          return false;
        }
      }
    }
    for (const y of eyes) {
      for (let x = Math.min(...exes); x <= Math.max(...exes); x += 100) {
        if (!isPointInPolygon({ x, y }, input)) {
          return false;
        }
      }
    }
    return true;
  };

  const sizes: { pointA: Point; pointB: Point; size: number }[] = [];
  //get all points and their sizes
  for (let i = 0; i < input.length - 1; i++) {
    for (let j = i + 1; j < input.length; j++) {
      const size =
        (Math.abs(input[i].x - input[j].x) + 1) *
        (Math.abs(input[i].y - input[j].y) + 1);
      sizes.push({
        pointA: { x: input[i].x, y: input[i].y },
        pointB: { x: input[j].x, y: input[j].y },
        size,
      });
    }
  }
  // order them biggest to smallest
  const orderedSizes = sizes.sort((a, b) => b.size - a.size);
  // go through each one to see if the all points* are in the polygon
  for (const rect of orderedSizes) {
    if (rect.size <= largest) {
      continue;
    }
    if (checkAllPoints(rect.pointA, rect.pointB)) {
      //because its ordered, the first value here is the biggest
      console.log(`Part B: ${rect.size}`);
      return;
    }
  }
  // * ended up not doing all the points because that was taking too long, did every 100th point along the edges of the rectangle
}
