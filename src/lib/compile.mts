import { exec, execSync } from "child_process";
import ora from "ora";
import chalk from "chalk";
import path from "path";
import { createReadStream, readFileSync, readdirSync, statSync, writeFileSync } from "fs";
import crypto from "crypto";

function isCrate(path: string) {
  const regex = /^(.*::)*\w+$/;
  return regex.test(path) ? path : false;
}

function isFile(path: string) {
  return path.endsWith(".cairo") ? path : false;
}

export const compile = (contract: string) => {
  let command: string = "";
  let d = new Date();
  let filename =
    d.getDate().toString() +
    (d.getMonth() + 1).toString() +
    d.getFullYear().toString() +
    d.getHours().toString() +
    d.getMinutes().toString() +
    ".json";

  let hash: string = "";

  switch (contract) {
    case isCrate(contract):
      // path::to::contract
      const fileName = filenameFromCratePath(contract);
      const filePath = findFile(fileName);

      hash = checkRecompilation(filePath);
      if (hash === "") return;
      command = `mkdir -p ./out && touch ./out/${filename} && touch ./out/latest.json && starknet-compile ./src --contract-path ${contract} ./out/${filename} && cat ./out/${filename} > ./out/latest.json`;
      break;
    case isFile(contract):
      // path/to/contract.cairo
      hash = checkRecompilation(contract);
      if (hash === "") return;
      command = `mkdir -p ./out && touch ./out/${filename} && touch ./out/latest.json && starknet-compile ${contract} ./out/${filename} --single-file && cat ./out/${filename} > ./out/latest.json`;
      break;
    default:
      console.log(
        `no target specified. ${chalk.yellow("usage: compile <path::to::contract | /path/to/contract.cairo>")}`
      );
      break;
  }

  const spinner = ora("compiling...").start();
  execSync(command);
  if (hash !== "") appendHashToLatest(hash);
  spinner.succeed("done!");
};

function checkRecompilation(contract: string) {
  const known_hash = getKnownHash();
  const new_hash = getHash(contract);

  if (known_hash === new_hash) {
    console.log(chalk.yellow("no changes detected, skipping!"));
    return "";
  }
  return new_hash;
}

function appendHashToLatest(known_hash: string) {
  const filename = "./out/latest.json";
  const data = readFileSync(filename, "utf8");
  const obj = JSON.parse(data);
  obj.hash = known_hash;
  const newData = JSON.stringify(obj, null, 2);
  writeFileSync(filename, newData);
}

function getKnownHash() {
  const filename = "./out/latest.json";
  try {
    const data = readFileSync(filename, "utf8");
    const obj = JSON.parse(data);
    return obj.hash;
  } catch (error) {
    return "";
  }
}

function getHash(filename: string) {
  const data = readFileSync(filename);
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  return hash;
}

function findFile(filename: string, dir = "./src"): string {
  const files = readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (statSync(filePath).isDirectory()) {
      const result = findFile(filename, filePath);
      if (result) return result;
    } else if (file === filename) {
      return filePath;
    }
  }
  return "";
}

function filenameFromCratePath(path: string) {
  const parts = path.split("::");
  return parts[parts.length - 2] + ".cairo";
}
