import { readFileSync } from "fs";
import { join } from "path";
export function syncReadFile(filename: string) {
  const result = readFileSync(join(__dirname, filename), "utf-8");
  return result;
}

export default function partA(): void {
  type Machine = {
    init: number;
    lights: number;
    buttons: number[];
    joltage: number[];
  };
  const input: Machine[] = syncReadFile("./input.txt")
    .split("\n")
    .map((line) => {
      const split = line.split(" ");
      let init = 0;
      let length = 0;
      let buttons: number[] = [];
      let joltage: number[] = [];
      for (const section of split) {
        if (section.includes("[")) {
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
          let buttRes = new Array(length).fill("0");
          for (let int of buttonSection) {
            buttRes[int] = "1";
          }
          buttons.push(parseInt(buttRes.join(""), 2));
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
  type node = {
    target: number;
    buttons: number[];
    result: number;
    steps: number;
  };
  const xor = (
    target: number,
    buttons: number[],
    result: number,
    steps: number
  ) => {
    const openList: node[] = [];
    openList.push({ target, buttons, result, steps });
    let index = 0;

    while (openList.length > 0) {
      let currentNode = openList.shift();
      let childrenNodes: node[] = [];
      index++;

      if (!currentNode) {
        continue;
      }
      for (let i = 0; i < currentNode.buttons.length; i++) {
        const nextRes = currentNode.buttons[i] ^ currentNode.result;
        if (nextRes === currentNode.target) {
          return currentNode.steps + 1;
        } else {
          childrenNodes.push({
            target,
            buttons,
            result: nextRes,
            steps: currentNode.steps + 1,
          });
        }
      }
      openList.push(...childrenNodes);
    }

    console.log("something went wrong");
    return 0;
  };
  let sum = 0;
  let index = 0;
  for (const machine of input) {
    console.log(machine);
    sum += xor(machine.init, machine.buttons, 0, 0);
    index++;
  }
  console.log(`Part A: ${sum}`);
}
