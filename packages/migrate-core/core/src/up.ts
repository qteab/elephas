import {} from "./compileMigrationFiles";
import { compileMigrationFiles, getMigrationFiles } from "./utility";
import { Logger } from "./types";
import { connect } from "./connect";
import { createMigrationTable } from "./createMigrationTable";
import { getRunMigrations } from "./getRunMigrations";
import { DatabasePool, sql } from "slonik";
import { z } from "zod";

type PoolOrConnectionUri =
  | {
      connectionUri: string;
    }
  | { pool: DatabasePool };

export const up = async (
  options: {
    logger?: Logger;
    migrationsPath: string;
  } & PoolOrConnectionUri
) => {
  const migrationFiles = getMigrationFiles(options.migrationsPath);
  const migrations = await compileMigrationFiles(migrationFiles);
  options.logger && options.logger.log("Connecting to database");
  const pool =
    "pool" in options ? options.pool : await connect(options.connectionUri);
  options.logger &&
    options.logger.log("Creating migration table if not exists");
  await createMigrationTable(pool);
  const alreadyRunMigrations = await getRunMigrations(pool);
  const migrationsToRun = migrations.filter(
    (m) =>
      alreadyRunMigrations.findIndex(
        (alreadyRun) => alreadyRun.name === m.name
      ) === -1
  );
  if (migrationsToRun.length < 1) {
    await pool.end();
    logger && logger.log("No migrations to run");
    return;
  }
  await pool.transaction(async (connection) => {
    for (let i = 0; i < migrationsToRun.length; ++i) {
      const migration = migrationsToRun[i];

      logger && logger.log(`Running migration: ${migration.name}`);
      await migration.up(connection);
      await connection.query(
        sql.type(
          z.object({}).strict()
        )`insert into migration (name) values (${migration.name})`
      );
    }
  });
  await pool.end();
};
