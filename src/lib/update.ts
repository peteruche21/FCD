import { exec, execSync } from "child_process";
import https from "https";
import ora from "ora";

export const update = () => {
  exec("cairo-compile --version", (error, stdout) => {
    const spinner = ora();

    if (error) {
      spinner.info("Cairo is not installed. run `fcd install` to install cairo\n");
      return;
    }

    const currentVersion = `v${stdout.split(" ")[1]}`;
    spinner.info(`Current version: ${currentVersion}\n`);
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
          spinner.succeed(`Latest version: ${latestTag}\n`);

          if (currentVersion === latestTag) {
            console.log("Cairo is up to date\n");
          } else {
            spinner.start("Updating Cairo...\n");
            // Update Cairo
            exec("cd $CAIRO_ROOT && git fetch && git pull && cargo build --all --release", (error) => {
              if (error) {
                spinner.fail(error.message);
                return;
              }
              spinner.succeed(`Cairo updated to version ${latestTag}\n`);
            });
          }
        });
      }
    );
  });
};
