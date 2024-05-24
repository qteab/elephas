import { DatabasePool } from "@qte/elephas-nest";

export interface ModuleOptions {
  connectionUri: string;
  migrationsPath?: string;
  afterMigrate?: (pool: DatabasePool) => Promise<void>;
}
