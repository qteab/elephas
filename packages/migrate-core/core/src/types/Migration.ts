import { MigrationFunction } from "./MigrationFunction";

export interface Migration {
  name: string;
  filePath: string;
  up: MigrationFunction;
  down: MigrationFunction;
}
