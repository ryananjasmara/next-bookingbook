// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj != null && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => ({
        ...result,
        [key.replace(/([-_][a-z])/gi, ($1) =>
          $1.toUpperCase().replace("_", "")
        )]: toCamelCase(obj[key]),
      }),
      {}
    );
  }
  return obj;
}
