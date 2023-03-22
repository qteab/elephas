import { ModuleMetadata } from "@nestjs/common";
import { ModuleOptions } from "./ModuleOptions";

export interface ModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => Promise<ModuleOptions> | ModuleOptions;
  providerName?: symbol;
  inject?: any[];
}
