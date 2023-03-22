import { Module, DynamicModule } from "@nestjs/common";
import { ElephasCoreModule } from "./elephas-core.module";
import { ModuleAsyncOptions } from "./types";

@Module({})
export class ElephasModule {
  public static forRootAsync(
    options: Omit<ModuleAsyncOptions, "test">
  ): DynamicModule {
    return {
      module: ElephasModule,
      imports: [ElephasCoreModule.forRootAsync(options)],
    };
  }
}
