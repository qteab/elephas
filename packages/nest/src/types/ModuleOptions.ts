import { ClientConfiguration, DatabasePool } from "slonik";

export interface ModuleOptions {
  connectionUri: string;
  options: Partial<ClientConfiguration>;
  afterConnect?: (pool: DatabasePool) => void | Promise<void>;
  afterClose?: () => void | Promise<void>;
}
