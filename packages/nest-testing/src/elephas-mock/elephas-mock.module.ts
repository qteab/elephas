import { Module, DynamicModule } from "@nestjs/common";
import { ElephasMockCoreModule } from "./elephas-mock-core.module";
import { ModuleAsyncOptions } from "./types";

@Module({})
export class ElephasMockModule {
  public static forRootAsync(
    options: Omit<ModuleAsyncOptions, "test">
  ): DynamicModule {
    return {
      module: ElephasMockModule,
      imports: [ElephasMockCoreModule.forRootAsync(options)],
    };
  }
}
