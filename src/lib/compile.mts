import { exec, execSync } from "child_process";
import https from "https";
import ora from "ora";
import chalk from "chalk";
import path from "path";

function isDir(path: string) {
  const regex = /^(\.\/|\/|[a-zA-Z]:\\)?[^<>:"|?*]*\/?$/;
  return regex.test(path) ? path : false;
}

function isFile(path: string) {
  return path.endsWith(".cairo") ? path : false;
}

export const compile = (program?: string | boolean, contract?: string | boolean) => {
  let command: string = "";

  function compileProgram() {
    switch (program) {
      case true:
        command = `cairo-compile -- ./src/main.cairo ./out/main.sierra --replace-ids`;
        break;
      case undefined:
        compileContract();
        break;
      default:
        command = `cairo-compile -- ${program} ./out/${path.basename(
          program.toString(),
          ".cairo"
        )}.sierra --replace-ids`;
        break;
    }
  }

  function compileContract() {
    switch (contract) {
      case undefined:
        // no option
        command = `starknet-compile ./src`;
        break;
      case true:
        // -c
        command = `starknet-compile ./src`;
        break;
      case isDir(contract?.toString()!):
        // -c path/to/folder
        command = `starknet-compile ${contract}`;
        break;
      case isFile(contract?.toString()!):
        // -c path/to/contract.cairo
        command = `starknet-compile ${contract} --single-file`;
        break;
      default:
        // -c contract_name
        command = `starknet-compile ./src/${contract}.cairo --single-file`;
        break;
    }
  }

  compileProgram();

  console.log(command);
};
