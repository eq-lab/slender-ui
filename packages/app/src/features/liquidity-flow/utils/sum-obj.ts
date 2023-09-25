export const sumObj = <T extends string>(
  obj1: {
    [K in T]?: bigint
  },
  obj2: {
    [K in T]?: bigint
  },
): {
  [K in T]?: bigint
} => {
  const result = {} as {
    [K in T]?: bigint
  }

  Object.entries(obj1).forEach((entry) => {
    const [key, value] = entry as [T, bigint]
    result[key] = value
    if (key in obj2) {
      result[key] = (result[key] ?? 0n) + (obj2[key] ?? 0n)
    }
  })

  Object.entries(obj2).forEach((entry) => {
    const [key, value] = entry as [T, bigint]
    if (!(key in obj1)) {
      result[key] = value
    }
  })

  return result
}
