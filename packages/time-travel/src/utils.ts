export const getKeys = <TObj>(obj: TObj): Array<keyof TObj> =>
  Object.keys(obj) as Array<keyof TObj>;

export const asArray = <T>(arg: T | T[]): T[] =>
  arg instanceof Array ? arg : [arg];
