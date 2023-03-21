export const makeSnakeCase = (str: string): string => {
  const snake = str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((s) => s.toLowerCase())
    .join("_");

  if (!snake) {
    throw new Error(`Could not convert to snake case:  "${str}"`);
  }
  return snake;
};
