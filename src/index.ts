import { Command } from "commander";
import figlet from "figlet";
import config from "../package.json";
import { install } from "./lib";

function printLogo() {
  console.log(
    figlet.textSync("CAIRO", {
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

program.parse(process.argv);

const options = program.opts();

// install

// update

// compile

// create-account

// run

// test

// declare

// deploy [contract name] [-c compile first and declare] [-l --local]

// node
