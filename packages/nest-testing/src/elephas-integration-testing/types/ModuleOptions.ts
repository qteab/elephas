import { ClientConfiguration, DatabasePool } from "@qte/elephas-nest";

export interface ModuleOptions {
  connectionUri: string;
  options?: Partial<ClientConfiguration>;
  migrationsPath?: string;
  afterMigrate?: (pool: DatabasePool) => Promise<void>;
}
