import { Command, Flags } from "@oclif/core";
import path from "path";
import { down } from "@qte/elephas-migrate-core";

export class Down extends Command {
  public static description = "Migrate up";

  public static flags = {
    connectionUri: Flags.string({
      char: "c",
      description: "Postgres connection URI",
      required: true,
    }),
  };

  // public static args = [
  //   {
  //     name: "count",
  //     description: "Number of migrations to go down",
  //     required: false,
  //   },
  // ];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Down);

    await down({
      connectionUri: flags.connectionUri,
      logger: {
        log: (message) => this.log(message),
      },
      migrationsPath: path.join(process.cwd(), "/migrations"),
    });
  }
}
