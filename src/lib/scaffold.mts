import chalk from "chalk";
import { exec } from "child_process";
import inquirer from "inquirer";
import ora from "ora";
import { Subject } from "rxjs";

export const scaffold = () => {
  const prompts: any = new Subject();

  let template: string | undefined;
  let nameInput: string | undefined;

  inquirer.prompt(prompts).ui.process.subscribe({
    next: ({ name, answer }) => {
      switch (name) {
        case "template":
          template = answer;
          switch (template) {
            case "scarb":
              initializeWithScarb(nameInput || ".");
              break;
            case "foundry":
              initializeWithFoundry(nameInput || ".");
              break;
            case "hardhat":
              initializeWithHardhat(nameInput || ".");
              break;
          }
          break;
        case "name":
          nameInput = answer;
          break;
        case "install":
          if (answer) {
            installHardhatPlugins(nameInput || ".");
          }
          break;
      }
    },
  });

  prompts.next({
    type: "input",
    name: "name",
    message: "name of your project?",
  });

  prompts.next({
    type: "list",
    name: "template",
    message: "please select a project template?",
    choices: [
      { name: "scarb", value: "scarb", short: "scarb" },
      { name: "foundry", value: "foundry", short: "foundry" },
      { name: "hardhat", value: "hardhat", short: "hardhat" },
    ],
  });

  if (template === "hardhat") {
    prompts.next({
      type: "confirm",
      name: "install",
      message: "run npm install?",
    });
  }

  prompts.complete();
};

function initializeWithScarb(name: string) {
  exec("scarb --version", (error) => {
    if (error) {
      console.log(
        chalk.yellow("scarb not found, Please run `fcd install` and select `scarb` from list of optional deps.")
      );
      process.exit(1);
    }
    const spinner = ora("Initializing scarb project").start();
    exec(`scarb new ${name}`, (error, stderr) => {
      if (error) {
        spinner.fail(chalk.red("Failed to initialize scarb project"));
        console.error(stderr);
        process.exit(1);
      }
      spinner.succeed("Initialized scarb project");
    });
  });
}

function initializeWithFoundry(name: string) {
  exec("snforge --version", (error) => {
    if (error) {
      console.log(
        chalk.yellow("foundry not found, Please run `fcd install` and select `foundry` from list of optional deps.")
      );
      process.exit(1);
    }
    const spinner = ora("Initializing foundry project").start();
    exec(
      `mkdir -p ./${name} && cd ${name} && git clone https://github.com/foundry-rs/starknet_forge_template.git . && rm -rf .git && git init --initial-branch=main && git add . && git commit -m "initial commit" 2>/dev/null`,
      (error, stderr) => {
        if (error) {
          spinner.fail(chalk.red("Failed to initialize foundry project"));
          console.error(stderr);
          process.exit(1);
        }
        spinner.succeed("Initialized foundry project");
      }
    );
  });
}

function initializeWithHardhat(name: string) {
  const spinner = ora("Initializing hardhat project").start();
  exec(
    `mkdir -p ./${name} && cd ${name} && git clone https://github.com/0xSpaceShard/starknet-hardhat-example.git . && rm -rf .git && git init --initial-branch=main && git add . && git commit -m "initial commit" 2>/dev/null`,
    (error, stderr) => {
      if (error) {
        spinner.fail(chalk.red("Failed to initialize hardhat project"));
        console.error(stderr);
        process.exit(1);
      }
      spinner.succeed("Initialized hardhat project");
    }
  );
}

function installHardhatPlugins(name: string) {
  exec(`cd ${name} && npm ci`);
}
