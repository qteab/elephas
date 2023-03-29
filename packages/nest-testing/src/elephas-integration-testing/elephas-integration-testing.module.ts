import { Module, DynamicModule } from "@nestjs/common";
import { ElephasIntegrationTestingCoreModule } from "./elephas-integration-testing-core.module";
import { ModuleAsyncOptions } from "./types";

@Module({})
export class ElephasIntegrationTestingModule {
  public static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    return {
      module: ElephasIntegrationTestingModule,
      imports: [ElephasIntegrationTestingCoreModule.forRootAsync(options)],
    };
  }
}
