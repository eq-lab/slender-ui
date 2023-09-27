import BigNumber from 'bignumber.js'

export const getDepositUsd = (
  value: BigNumber | string,
  priceInUsd?: number,
  discount?: number,
): number => {
  if (!priceInUsd || !discount) {
    return 0
  }
  return BigNumber(value || 0)
    .div(priceInUsd)
    .times(discount)
    .toNumber()
}
