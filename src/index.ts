import { Command } from "commander";
import figlet from "figlet";
import config from "../package.json";

console.log(figlet.textSync("FCD"));

const program = new Command();

program
  .version(`Version ${config.version}`)
  .description("Starknet Faucet Contract Deployer, (FCD)")
  .option("compile, -c  [contract]", "Compile your Cairo Contract")
  .option("declare, -s <contract name>", "Declare your Sierra Class")
  .option("deploy, -d <contract name> [-c]", "Deploy an instance of your contract, optionally pass -c to compile first")
  .parse(process.argv);

const options = program.opts();
