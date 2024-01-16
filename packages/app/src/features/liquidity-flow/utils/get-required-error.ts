export const getRequiredError = ({
  value: rawValue,
  valueDecimals,
  showExtraInput,
  extraValue: rawExtraValue,
  extraValueDecimals = 0,
}: {
  value: string;
  valueDecimals: number;
  showExtraInput?: boolean;
  extraValue?: string;
  extraValueDecimals?: number;
}) => {
  const value = Number(rawValue);
  const hasCoreValueRequiredError = !value || value < 1 / 10 ** valueDecimals;
  if (!showExtraInput || !hasCoreValueRequiredError) return hasCoreValueRequiredError;

  const extraValue = Number(rawExtraValue);
  return !extraValue || extraValue < 1 / 10 ** extraValueDecimals;
};
