import { exec, execSync } from "child_process";
import https from "https";
import ora from "ora";
import chalk from "chalk";

export const update = (latest?: boolean) => {
  exec("cairo-compile --version", (error, stdout) => {
    const spinner = ora();

    if (error) {
      spinner.warn(chalk.yellow("Cairo is not installed. run `fcd install` to install cairo\n"));
      return;
    }

    const currentVersion = `v${stdout.split(" ")[1]}`;
    spinner.info(`Installed Cairo Version: ${currentVersion}\n`);
    spinner.start(`Checking for updates...`);

    https.get(
      {
        hostname: "api.github.com",
        path: "/repos/starkware-libs/cairo/releases/latest",
        headers: { "User-Agent": "node.js" },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          const release = JSON.parse(data);
          const latestTag = release.tag_name;
          spinner.succeed(`${chalk.yellow(`Latest Cairo Release Version: ${latestTag}`)}`);

          !latest &&
            spinner.info(`${chalk.yellow("To install the latest release version, run `fcd update --latest`.")}\n`);

          if (currentVersion.trim() === latestTag.trim()) {
            spinner.info("Cairo is up to date\n");
          } else {
            spinner.start("Updating Cairo...\n");
            // Update Cairo
            exec(
              `cd $CAIRO_ROOT && git fetch && ${
                latest ? `git checkout ${latestTag}` : "git checkout main && git pull"
              } && cargo build --all --release`,
              (error) => {
                if (error) {
                  spinner.fail(error.message);
                  return;
                }
                spinner.succeed(`Done!`);
                const curVersion = execSync("cairo-compile --version");
                spinner.succeed(`Installed Cairo v${curVersion.toString().split(" ")[1]}\n`);
              }
            );
          }
        });
      }
    );
  });
};
