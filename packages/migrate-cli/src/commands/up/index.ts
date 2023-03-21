import { Command, Flags } from "@oclif/core";
// import fs, { existsSync, readFileSync } from "fs";
import path from "path";
import { up } from "@qte/elephas-migrate-core";
// import { createMigrationTable, initialize } from "../../database";
// import * as ts from "typescript";
// import { Client } from "pg";
// import requireFromString from "require-from-string";
// import { Migration } from "../../types";

export class Up extends Command {
  public static description = "Migrate up";

  public static flags = {
    connectionString: Flags.string({
      char: "c",
      description: "Postgres connection string",
      required: true,
    }),
  };

  // public static args = [
  //   {
  //     name: "count",
  //     description: "Number of migrations to go up",
  //     required: false,
  //   },
  // ];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Up);

    up({
      logger: { log: (message) => this.log(message) },
      migrationsPath: path.join(process.cwd(), "/migrations"),
      connectionUri: flags.connectionString,
    });
  }
}
