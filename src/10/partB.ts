import { readFileSync } from "fs";
import { join } from "path";
import { equalTo, solve } from "yalps";
import {
  Model,
  Constraint,
  Coefficients,
  OptimizationDirection,
  Options,
  Solution,
} from "yalps";
import * as math from "mathjs";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}
function deepEquals(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEquals(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
export default function partB(): void {
  type Machine = {
    init: number;
    lights: number;
    buttons: number[][];
    joltage: number[];
  };
  const input: Array<Machine> = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => {
      const split = line.split(" ");
      let init = 0;
      let length = 0;
      let buttons: number[][] = [];
      let joltage: number[] = [];
      for (const section of split) {
        if (section.includes("[")) {
          // init
          const start = section.replace("[", "").replace("]", "");
          length = start.length;
          init = parseInt(
            start.replaceAll(/\./g, "0").replaceAll(/\#/g, "1"),
            2
          );
        } else if (section.includes("(")) {
          const buttonSection = section
            .replace("(", "")
            .replace(")", "")
            .split(",")
            .map((num) => Number(num));
          buttons.push(buttonSection);
        } else if (section.includes("{")) {
          const joltageSection = section
            .replace("{", "")
            .replace("}", "")
            .split(",")
            .map((num) => Number(num));
          joltage.push(...joltageSection);
        }
      }
      return {
        init,
        buttons,
        joltage,
        lights: length,
      };
    });

  let sum = 0;
  for (const machine of input) {
    const integers = Array.from({ length: machine.joltage.length }, (_, i) =>
      i.toString()
    );
    const variables = Object.fromEntries(
      Array.from({ length: machine.buttons.length }, (_, i) => i).map((num) => {
        return [
          num,
          Object.fromEntries([
            ...machine.buttons[num].map((val) => [val, 1]),
            ["sum", 1],
          ]),
        ];
      })
    );
    const constraints = Object.fromEntries(
      Array.from({ length: machine.joltage.length }, (_, i) => [
        i,
        equalTo(machine.joltage[i]),
      ])
    );

    const direction: OptimizationDirection = "minimize";
    const objective = "sum";
    const model1 = {
      direction,
      objective,
      constraints,
      variables,
      integers,
    };
    const solution1 = solve(model1);
    const amount = solution1.result;

    sum += amount;
  }

  // console.log(math.transpose(input[0].buttons));
  /**
   * (3)    1 0 0 0 => 1
   * (1,3)  1 0 1 0 => 3
   * (2)    0 1 0 0 => 0
   * (2,3)  1 1 0 0 => 3
   * (0,2)  0 1 0 1 => 1
   * (0,1)  0 0 1 1 => 2
   *
   *        3 5 4 7
   *
   *  (3) once, (1,3) three times, (2,3) three times, (0,2) once, and (0,1) twice.
   */
  console.log(`Part B: ${sum}`);
}
