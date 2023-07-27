import { Command } from "commander";
import figlet from "figlet";
import config from "../package.json";
import { install, update } from "./lib";

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
  .action(() => {
    printLogo();
    update();
  });

program
  .command("compile")
  .description("Compile a cairo program or starknet contract")
  .action(() => {
    printLogo();
    console.log("compile");
  });

program.parse(process.argv);

// compile [default -c] -p for program -c for contract [path to program or contract/contract folder]

// node start a local node with katana dojo

// create-account [alias name]

// run [path to program] [-c compile first]

// declare [contract name] [-c compile first and declare]

// deploy [contract name] [-c compile first and declare] [-l --local]
