import {
  compileMigrationFiles,
  connect,
  getMigrationFiles,
  getRunMigrations,
} from "./utility";
import { Logger } from "./types";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

type PoolOrConnectionUri =
  | {
      connectionUri: string;
    }
  | { pool: DatabasePool };

export const down = async (
  options: {
    logger?: Logger;
    migrationsPath: string;
  } & PoolOrConnectionUri
) => {
  const migrationFiles = getMigrationFiles(options.migrationsPath);
  const migrations = compileMigrationFiles(migrationFiles);

  options.logger && options.logger.log("Connecting to database");
  const pool =
    "pool" in options ? options.pool : await connect(options.connectionUri);

  const alreadyRunMigrations = await getRunMigrations(pool);
  const migrationToRemove = alreadyRunMigrations.pop();
  if (!migrationToRemove) {
    await pool.end();
    options.logger && options.logger.log("No migrations to run");
    return;
  }
  const migrationsToRun = migrations.filter(
    (m) => m.name === migrationToRemove.name
  );
  if (migrationsToRun.length < 1) {
    await pool.end();
    options.logger && options.logger.log("No migrations to run");
    return;
  }

  await pool.transaction(async (connection) => {
    for (let i = 0; i < migrationsToRun.length; ++i) {
      const migration = migrationsToRun[i];
      if (!migration) {
        throw new Error("Invalid migration");
      }
      options.logger &&
        options.logger.log(`Running migration: ${migration.name} DOWN`);
      await migration.down(connection);
      await connection.query(sql.type(
        z.object({}).strict({})
      )`delete from migration where
        name = ${migration.name}`);
    }
  });

  await pool.end();
};
