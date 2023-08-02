import { Command } from "commander";
import figlet from "figlet";
import config from "../package.json" assert { type: "json" };
import { compile, install, node, scaffold, update } from "./lib/index.mjs";

function printLogo(text?: string) {
  console.log(
    figlet.textSync(text || "STARKNET", {
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
  .argument("[shell]", "which shell, `zsh | bash | fish | other`")
  .action((shell) => {
    console.log();
    printLogo();
    install(shell);
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
  .argument("<path>", "path to contract, or path to crate")
  .action((contract) => {
    printLogo();
    compile(contract);
  });

program
  .command("new")
  .description("Create a new starknet project")
  .action(() => {
    printLogo();
    scaffold();
  });

program
  .command("node")
  .description("Start a local node with katana dojo")
  .action(() => {
    node();
  });

program
  .command("account")
  .description("Create and manage starknet accounts")
  .action(() => {
    printLogo();
    console.log("account");
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

// new bootstraps a new starknet project [carb, foundry, hardhart]

// node start a local node with katana dojo

// account [alias name]

// declare [contract name] [-c compile first] [-h --handle-cost]

// deploy [contract name] [-c compile and declare first] [-l --local || -h --handle-cost]
