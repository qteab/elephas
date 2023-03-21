import fs from "fs";
import requireFromString from "require-from-string";
import * as ts from "typescript";
import { Migration } from "~/types";

export const compileMigrationFiles = (
  migrations: Pick<Migration, "name" | "filePath">[]
): Migration[] => {
  return migrations.map((migration) => {
    const source = fs.readFileSync(migration.filePath, { encoding: "utf-8" });
    const result = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    });

    return {
      ...migration,
      ...(requireFromString(result.outputText) as Pick<
        Migration,
        "up" | "down"
      >),
    };
  });
};
