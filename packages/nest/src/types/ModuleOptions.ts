import { ClientConfiguration } from "slonik";

export interface ModuleOptions {
  connectionUri: string;
  options: Partial<ClientConfiguration>;
}
