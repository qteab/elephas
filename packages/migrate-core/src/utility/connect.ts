import { createPool, createTypeParserPreset } from "slonik";

export const connect = async (connectionUri: string) => {
  return createPool(connectionUri, {
    typeParsers: [...createTypeParserPreset()],
  });
};
