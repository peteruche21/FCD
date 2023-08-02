import chalk from "chalk";
import { exec, execSync } from "child_process";

export const node = () => {
  exec("katana --version 2>/dev/null", (error) => {
    if (error) {
      console.log(
        chalk.yellow("Katana is not installed. Please run `fcd install` and select katana from list of optional deps.")
      );
      return;
    }

    execSync("katana", { stdio: "inherit" });
  });
};
