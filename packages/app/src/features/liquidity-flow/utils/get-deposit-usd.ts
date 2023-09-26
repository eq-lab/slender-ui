export const getDepositUsd = (value: number | string, priceInUsd?: number, discount?: number) => {
  if (!priceInUsd || !discount) {
    return 0
  }
  return (Number(value) / priceInUsd) * discount
}
