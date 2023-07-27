import { execSync } from "child_process";
import os from "os";
import path from "path";
import ora from "ora";

const addToPath = (shell: "zsh" | "bash" | "fish" | string) =>
  shell === "fish"
    ? `set -Ux CAIRO_ROOT $HOME/.cairo
    fish_add_path $CAIRO_ROOT/target/release
    `
    : `    
    echo 'export CAIRO_ROOT="$HOME/.cairo"' >> ~/.${shell}rc
    echo 'command -v cairo-compile >/dev/null || export PATH="$CAIRO_ROOT/target/release:$PATH"' >> ~/.${shell}rc
    `;

export const install = () => {
  try {
    execSync("cairo-compile --version");
    console.log("\n Cairo is already installed 👉 👈\n");
  } catch (error) {
    console.log("\n Installing Cairo... 👉 👈\n");

    const shellPath = os.userInfo().shell;
    const shell = path.basename(shellPath);

    const spinner = ora();

    try {
      spinner.start("Updating your rust installation...\n");
      console.log("");
      execSync("rustup override set stable && rustup update");
      spinner.succeed();
    } catch (error: any) {
      spinner.fail(error.message);
      return;
    }

    try {
      spinner.start("Installing...\n");
      console.log("");
      execSync(
        `curl -L https://github.com/franalgaba/cairo-installer/raw/main/bin/cairo-installer 2>/dev/null | ${shell}`
      );
      spinner.succeed("Cairo installed!\n");
    } catch (error: any) {
      spinner.fail(error.message);
      return;
    }

    try {
      spinner.start("Adding cairo to PATH...\n");
      console.log("");
      execSync(addToPath(shell));
      spinner.succeed("Cairo Added to PATH!\n");
      spinner.info("Please restart your terminal and Run `cairo-compile --version` to verify installation\n");
    } catch (error: any) {
      spinner.fail(error.message);
      return;
    }
  }
};
