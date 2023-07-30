import { Command } from "commander";
import figlet from "figlet";
import config from "../package.json" assert { type: "json" };
import { compile, install, update } from "./lib/index.mjs";

function printLogo(text?: string) {
  console.log(
    figlet.textSync(text || "CAIRO", {
      font: "Small Poison",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
}

const program = new Command();

program
  .name("FCDMeta")
  .description("Starknet Faucet Contract Deployer using Meta Tx, (FCDMeta)")
  .version(`version ${config.version}`);

program
  .command("install")
  .description("Install Cairo")
  .action(() => {
    printLogo();
    install();
  });

program
  .command("update")
  .description("Update Cairo to latest version")
  .option("-l, --latest", "Update your Cairo to the latest release version")
  .action((options) => {
    printLogo();
    update(options.latest);
  });

program
  .command("compile")
  .description("Compile a cairo program or starknet contract")
  .option("-p, --program [path]", "Path to program or folder containing main.cairo (default: ./src)")
  .option(
    "-c, --contract [name | path]",
    "Contract name, path to contract, or path to contract folder containing cairo_project.toml (default: ./src)"
  )
  .action((options) => {
    printLogo();
    compile(options.program, options.contract);
  });

program
  .command("new")
  .description("Create a new starknet project")
  .action(() => {
    printLogo();
    console.log("new");
  });

program
  .command("node")
  .description("Start a local node with katana dojo")
  .action(() => {
    printLogo();
    console.log("node");
  });

program
  .command("create-account")
  .description("Create a new starknet account")
  .action(() => {
    printLogo();
    console.log("create-account");
  });

program
  .command("run")
  .description("Run a starknet program")
  .action(() => {
    printLogo();
    console.log("run");
  });

program
  .command("declare")
  .description("Declare a starknet contract")
  .action(() => {
    printLogo();
    console.log("declare");
  });

program
  .command("deploy")
  .description("Deploy a starknet contract")
  .action(() => {
    printLogo();
    console.log("deploy");
  });

program.parse(process.argv);

// install additional tools
// [x] starknet cli
// [x] carb
// [x] katana
// [x] starknet-foundry
// [x] warp

// new bootstraps a new starknet project [fcd, carb, foundry, hardhart, warp]

// node start a local node with katana dojo

// create-account [alias name]

// run [path to program] [-c compile first]

// declare [contract name] [-c compile first and declare] [-h --handle-cost]

// deploy [contract name] [-c compile first and declare] [-l --local || -h --handle-cost]
