import { Command } from "commander";
import figlet from "figlet";
import config from "../package.json";

function printLogo() {
  console.log(
    figlet.textSync("FCDMeta", {
      font: "Ghost",
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
  .option("compile, -c  [contract]", "Compile your Cairo Contract")
  .option("declare, -s <contract name>", "Declare your Sierra Class")
  .option(
    "deploy, -d <contract name> [-c]",
    "Deploy an instance of your contract, optionally pass -c to compile first"
  );

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
