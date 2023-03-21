import { Command, Flags } from "@oclif/core";
import path from "path";
import { sql } from "slonik";
import { z } from "zod";
// import fs, { existsSync, readFileSync } from "fs";
// import path from "path";
// import { createMigrationTable, initialize } from "../../database";
// import * as ts from "typescript";
// import { Client } from "pg";
// import requireFromString from "require-from-string";
// import { Migration } from "../../types";

export class Down extends Command {
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
  //     description: "Number of migrations to go down",
  //     required: false,
  //   },
  // ];

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Down);

    // down

    const migrationFiles = getMigrationFiles(
      path.join(process.cwd(), "/migrations")
    );
    const migrations = compileMigrationFiles(migrationFiles);
    this.log("Connecting to database");
    const pool = await connect(flags.connectionString);
    const alreadyRunMigrations = await getRunMigrations(pool);
    const migrationToRemove = alreadyRunMigrations.pop();
    if (!migrationToRemove) {
      await pool.end();
      this.log("No migrations to run");
      return;
    }
    const migrationsToRun = migrations.filter(
      (m) => m.name === migrationToRemove.name
    );
    if (migrationsToRun.length < 1) {
      await pool.end();
      this.log("No migrations to run");
      return;
    }

    await pool.transaction(async (connection) => {
      for (let i = 0; i < migrationsToRun.length; ++i) {
        const migration = migrationsToRun[i];
        this.log(`Running migration: ${migration.name} DOWN`);
        await migration.down(connection);
        await connection.query(sql.type(
          z.object({}).strict({})
        )`delete from migration where
          name = ${migration.name}`);
      }
    });

    await pool.end();
  }
}
