export const getRequiredError = (value: string, extraValue?: string, showExtraInput?: boolean) => {
  const hasCoreValueRequiredError = !Number(value)
  if (!showExtraInput) return hasCoreValueRequiredError
  const hasExtraValueRequiredError = !Number(extraValue)

  return hasCoreValueRequiredError && hasExtraValueRequiredError
}
