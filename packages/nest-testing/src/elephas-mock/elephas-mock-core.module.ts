import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";
import {
  createMockPool,
  createPool,
  DatabasePool,
  DEFAULT_POOL_PROVIDER_KEY,
  ElephasModule,
  parseDsn,
  stringifyDsn,
} from "@qte/elephas-nest";

import { ModuleAsyncOptions, ModuleOptions } from "./types";
import { MODULE_OPTIONS_PROVIDER_KEY } from "./elephas-mock.constants";

@Global()
@Module({})
export class ElephasMockCoreModule {
  public static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    const mockProviderKey = DEFAULT_POOL_PROVIDER_KEY || options.providerName;
    const optionsProvider: FactoryProvider = {
      provide: MODULE_OPTIONS_PROVIDER_KEY,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const mockDatabaseProvider: FactoryProvider = {
      provide: mockProviderKey,
      inject: [optionsProvider.provide],
      useFactory: async (syncOptions: ModuleOptions) => {
        return createMockPool(syncOptions.overrides);
      },
    };

    return {
      module: ElephasMockCoreModule,
      providers: [optionsProvider, mockDatabaseProvider],
    };
  }
}
