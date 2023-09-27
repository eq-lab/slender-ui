import BigNumber from 'bignumber.js'

export const sumObj = <T extends string>(
  obj1: {
    [K in T]?: BigNumber
  },
  obj2: {
    [K in T]?: BigNumber
  },
): {
  [K in T]?: BigNumber
} => {
  const result = {} as {
    [K in T]?: BigNumber
  }

  Object.entries(obj1).forEach((entry) => {
    const [key, value] = entry as [T, BigNumber]
    result[key] = value
    if (key in obj2) {
      result[key] = (result[key] ?? BigNumber(0)).plus(obj2[key] ?? 0)
    }
  })

  Object.entries(obj2).forEach((entry) => {
    const [key, value] = entry as [T, BigNumber]
    if (!(key in obj1)) {
      result[key] = value
    }
  })

  return result
}
