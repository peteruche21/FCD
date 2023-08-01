import { exec, execSync } from "child_process";
import os from "os";
import path from "path";
import ora, { Ora } from "ora";
import chalk from "chalk";
import inquirer from "inquirer";

const CAIRO_ROOT = path.join(os.homedir(), ".cairo");

const addToPath = (shell: "zsh" | "bash" | "fish" | string) =>
  shell === "fish"
    ? `set -Ux CAIRO_ROOT ${CAIRO_ROOT}
    fish_add_path $CAIRO_ROOT/target/release
    `
    : `    
    echo 'export CAIRO_ROOT="${CAIRO_ROOT}"' >> ~/.${shell}rc \
    echo 'command -v cairo-compile >/dev/null || export PATH="$CAIRO_ROOT/target/release:$PATH"' >> ~/.${shell}rc
    `;

export const install = (_shell?: string) => {
  const spinner = ora();
  const shellPath = os.userInfo().shell;
  const shell = _shell || path.basename(shellPath);

  try {
    execSync("cairo-compile --version");
    spinner.succeed("Cairo is already installed 👉 👈\n");
  } catch (error) {
    spinner.info("Installing Cairo... 👉 👈\n");

    try {
      spinner.start("Updating your rust installation...\n");
      execSync("rustup override set stable && rustup update");
      spinner.succeed();
    } catch (error: any) {
      spinner.fail(error.message);
      return;
    }

    try {
      spinner.start("Installing...\n");
      execSync(
        `curl -L https://github.com/franalgaba/cairo-installer/raw/main/bin/cairo-installer 2>/dev/null | ${shell}`
      );
      spinner.succeed("Cairo installed!\n");
    } catch (error: any) {
      spinner.fail(chalk.red(error.message));
      return;
    }

    try {
      spinner.start("Adding cairo to PATH...\n");
      execSync(addToPath(shell));
      spinner.succeed("Cairo Added to PATH!\n");
      spinner.info(
        chalk.yellow("Please restart your terminal and Run `cairo-compile --version` to verify installation\n")
      );
    } catch (error: any) {
      spinner.fail(chalk.yellow(error.message));
      return;
    }
  }

  const uname = os.platform();

  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "additionalTools",
        message: "Which additional dev tools would you like to install?",
        choices: [
          { name: "Cairo CLI - python based cairo cli", value: "starknet", short: "cairo-cli" },
          { name: "Scarb - cairo package manager", value: "scarb", short: "scarb", checked: true },
          { name: "Starknet foundry - development and testing framework", value: "foundry", short: "snFoundry" },
          { name: "Dojo - developer toolchain for starknet gaming", value: "dojo", short: "dojo" },
          { name: "Katana (by dojo team) - run local starknet nodes", value: "katana", short: "katana" },
        ],
      },
    ])
    .then((answers) => {
      if (answers.additionalTools.includes("scarb")) {
        installCarb(spinner);
      }
      if (answers.additionalTools.includes("foundry")) {
        installFoundry(spinner);
      }
      if (answers.additionalTools.includes("dojo")) {
        installDojo(spinner, shell);
      } else if (answers.additionalTools.includes("katana")) {
        installKatana(spinner, shell);
      }
      if (answers.additionalTools.includes("starknet")) {
        installCairoCLI(spinner, uname);
      }
      spinner.succeed("All done!\n");
    });

  execSync(`exec ${shell}`);
};

export const installCairoCLI = (spinner: Ora, uname: string) => {
  try {
    execSync("source $HOME/cairo_venv/bin/activate && starknet --version 2>/dev/null");
    spinner.succeed("Cairo-cli is already installed 👉 👈\n");
  } catch (error) {
    if (uname === "darwin") {
      exec(`brew install gmp`, () => {});
    }
    try {
      spinner.start("Installing Cairo CLI ...\n");
      execSync(
        `python3 -m venv ~/cairo_venv && source ~/cairo_venv/bin/activate && pip install cairo-lang 2>/dev/null`
      );
      spinner.succeed("Cairo CLI installed!\n");
    } catch (error: any) {
      spinner.fail(error.message);
      spinner.info(
        "Please install Cairo CLI manually. https://docs.starknet.io/documentation/getting_started/environment_setup/#installing_the_cairo_cli\n"
      );
    }
  }
};

export const installCarb = (spinner: Ora) => {
  try {
    execSync("scarb --version 2>/dev/null");
    spinner.succeed("Scarb is already installed 👉 👈\n");
  } catch (error) {
    try {
      spinner.start("Installing scarb ...\n");
      execSync("curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh 2>/dev/null");
      spinner.succeed("Scarb installed!\n");
    } catch (error: any) {
      spinner.fail(error.message);
    }
  }
};

export const installDojo = (spinner: Ora, shell?: string) => {
  try {
    execSync("sozo --version 2>/dev/null");
    spinner.succeed("dojo is already installed 👉 👈\n");
  } catch (error) {
    try {
      spinner.start(`Installing dojo ...\n ${chalk.yellow("this will install `sozo`, `katana` and `torii`")}\n`);
      execSync(`curl -L https://install.dojoengine.org | ${shell} 2>/dev/null`);
      addDojoToPath(shell);
      execSync(`dojoup 2>/dev/null`);
      execSync(`rm -rf ${path.join(os.homedir(), ".cargo")}/bin/katana 2>/dev/null`);
      spinner.succeed(`${chalk.yellow("sozo")}, ${chalk.yellow("katana")} and ${chalk.yellow("torii")} installed!\n`);
    } catch (error: any) {
      spinner.fail(error.message);
    }
  }
};

export const installKatana = (spinner: Ora, shell?: string) => {
  const DOJO_ROOT = path.join(os.homedir(), ".dojo");
  try {
    execSync("katana --version 2>/dev/null");
    spinner.succeed("katana is already installed 👉 👈\n");
  } catch (error) {
    spinner.start("Installing katana ...\n");
    try {
      execSync(`mkdir ${DOJO_ROOT} 2>/dev/null`);
      execSync(
        `cd ${DOJO_ROOT} &&  git clone https://github.com/dojoengine/dojo.git . && cargo install --path ./crates/katana --force 2>/dev/null`
      );
      spinner.succeed(`katana installed!\n`);
    } catch (error) {
      try {
        execSync(`cd ${DOJO_ROOT} && cargo install --path ./crates/katana --force 2>/dev/null`);
        spinner.succeed("katana installed!\n");
      } catch (error: any) {
        spinner.fail(error.message);
      }
    }
  }
  addDojoToPath(shell);
};

const addDojoToPath = (shell?: string) => {
  const DOJO_ROOT = path.join(os.homedir(), ".dojo");
  const CARGO_ROOT = path.join(os.homedir(), ".cargo");
  execSync(`echo 'export PATH="$PATH:${DOJO_ROOT}/bin:${CARGO_ROOT}/bin"' >> ~/.${shell}rc && exec ${shell}`);
};

export const installFoundry = (spinner: Ora) => {
  try {
    execSync("snforge --version 2>/dev/null");
    spinner.succeed("snFoundry is already installed 👉 👈\n");
  } catch (error) {
    try {
      spinner.start("Installing snFoundry ...\n");
      execSync(
        "curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh 2>/dev/null"
      );
      spinner.succeed("snFoundry installed!\n");
    } catch (error: any) {
      spinner.fail(error.message);
    }
  }
};
