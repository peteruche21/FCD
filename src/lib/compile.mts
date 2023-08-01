import { exec, execSync } from "child_process";
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

export const compile = (contract?: string | boolean) => {
  let command: string = "";

  function compileContract() {
    switch (contract) {
      case undefined:
        // no option
        command = `starknet-compile ./src`;
        break;
      case isDir(contract?.toString()!):
        // path/to/folder
        command = `starknet-compile ${contract}`;
        break;
      case isFile(contract?.toString()!):
        // path/to/contract.cairo
        command = `starknet-compile ${contract} --single-file`;
        break;
      default:
        // contract_name
        command = `starknet-compile ./src/${contract}.cairo --single-file`;
        break;
    }
  }

  compileContract();

  console.log(command);
};
