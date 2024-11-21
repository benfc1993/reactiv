export function deepClone<TObject extends Record<string, any>>(
  obj: TObject
): TObject {
  return Object.entries(obj).reduce(
    (acc: Record<string, any>, [key, value]) => {
      acc[key] =
        value instanceof Array
          ? value.map((value) => deepClone(value))
          : value instanceof Object
            ? deepClone(value)
            : value
      return acc
    },
    {}
  ) as TObject
}