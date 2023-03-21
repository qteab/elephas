import fs from "fs";
import path from "path";

export const getMigrationFiles = (migrationsPath: string) => {
  if (!fs.existsSync(migrationsPath)) {
    throw new Error(`Migrations directory ${migrationsPath} does not exist`);
  }

  const files = fs.readdirSync(migrationsPath);

  return files.map((f) => ({
    name: path.basename(f),
    filePath: path.join(migrationsPath, "/" + f),
  }));
};
