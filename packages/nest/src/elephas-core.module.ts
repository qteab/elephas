import { DynamicModule, FactoryProvider, Global, Module } from "@nestjs/common";
import { createPool, DatabasePool } from "slonik";

import { createResultParserInterceptor } from "./interceptors";
import { ElephasCloserService } from "./elephas-closer.service";
import { ModuleAsyncOptions, ModuleOptions } from "./types";
import {
  DEFAULT_POOL_PROVIDER_KEY,
  MODULE_OPTIONS_KEY,
} from "./elephas.constants";

@Global()
@Module({})
export class ElephasCoreModule {
  public static forRootAsync(options: ModuleAsyncOptions): DynamicModule {
    const providerKey = options.providerName || DEFAULT_POOL_PROVIDER_KEY;

    const optionsProvider = {
      provide: MODULE_OPTIONS_KEY,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    const databasePoolProvider: FactoryProvider = {
      provide: providerKey,
      inject: [MODULE_OPTIONS_KEY],
      useFactory: async (syncOptions: ModuleOptions) => {
        const pool = await createPool(syncOptions.connectionUri, {
          interceptors: [createResultParserInterceptor()],
          typeParsers: [
            {
              name: "timestamptz",
              parse: (value) => {
                return value === null
                  ? value
                  : new Date(value + " UTC").toISOString();
              },
            },
          ],
          ...syncOptions.options,
        });

        syncOptions.afterConnect && (await syncOptions.afterConnect(pool));

        return pool;
      },
    };

    const closerProvider: FactoryProvider = {
      provide: ElephasCloserService,
      inject: [providerKey, optionsProvider.provide],
      useFactory: (pool: DatabasePool, syncOptions: ModuleOptions) =>
        new ElephasCloserService(pool, syncOptions),
    };

    return {
      module: ElephasCoreModule,
      imports: options.imports,
      providers: [optionsProvider, databasePoolProvider, closerProvider],
      exports: [databasePoolProvider],
    };
  }
}
