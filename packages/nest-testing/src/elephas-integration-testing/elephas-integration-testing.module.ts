import { Module, DynamicModule } from "@nestjs/common";
import { ElephasIntegrationTestingCoreModule } from "./elephas-integration-testing-core.module";
import { ModuleAsyncOptions, ModuleOptions } from "./types";

@Module({})
export class ElephasIntegrationTestingModule {
  public static forRootAsync(
    options: Omit<ModuleAsyncOptions, "test">
  ): DynamicModule {
    return {
      module: ElephasIntegrationTestingModule,
      imports: [ElephasIntegrationTestingCoreModule.forRootAsync(options)],
    };
  }
}
