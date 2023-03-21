import { Args, Command } from "@oclif/core";
import fs from "fs";
import path from "path";
import { makeSnakeCase } from "~/utility";

export class Create extends Command {
  public static description = "Create a migration";

  // public static aliases = ["create"];

  //   static examples = [
  //     `$ oex hello friend --from oclif
  // hello friend from oclif! (./src/commands/hello/index.ts)
  // `,
  //   ]

  public static args = {
    name: Args.string({
      name: "name", // name of arg to show in help and reference with args[name]
      required: true, // make the arg required with `required: true`
      description: "Migration name", // help description
      // hidden: true,               // hide this arg from help
      // parse: input => 'output',   // instead of the user input, return a different value
      // default: 'world',           // default value if no arg input
      // options: ['a', 'b'],        // only allow input to be from a discrete set
    }),
  };
  // public static args = [
  //   { name: "name", description: "Migration name", required: true },
  // ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Create);

    this.log(`Creating migration: ${args.name}`);

    this.log(process.cwd());

    if (!fs.existsSync(path.join(process.cwd(), "/migrations"))) {
      this.log("Creating migrations directory");
      fs.mkdirSync(path.join(process.cwd(), "/migrations"));
    }

    const nowUnix = Math.ceil(new Date().getTime() / 1000);

    const migrationFilePath = path.join(
      process.cwd(),
      "/migrations",
      `${nowUnix}_${makeSnakeCase(args.name)}.ts`
    );

    const migrationTemplate = fs.readFileSync(
      path.join(__dirname, "../../../templates/migration-template.ts")
    );

    fs.writeFileSync(migrationFilePath, migrationTemplate);
  }
}
