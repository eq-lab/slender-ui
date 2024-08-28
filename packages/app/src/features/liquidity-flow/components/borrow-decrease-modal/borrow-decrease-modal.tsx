import React, { useState } from 'react';
import { SupportedTokenName } from '@/shared/stellar/constants/tokens';
import { PositionCell } from '@/entities/position/types';
import { PositionSummary } from '@/entities/position/components/position-summary';
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name';
import BigNumber from 'bignumber.js';
import { TokenSuperField } from '@/shared/components/token-super-field';
import { formatCompactCryptoCurrency } from '@/shared/formatters';
import { useContextSelector } from 'use-context-selector';
import { CurrencyRatesContext } from '@/entities/currency-rates/context/context';
import { useTokenInfo } from '../../hooks/use-token-info';
import { LiquidityModal } from '../modal/liquidity-modal';
import { getPositionInfo } from '../../utils/get-position-info';
import { FormLayout } from '../form-layout';
import { getRequiredError } from '../../utils/get-required-error';
import { makePosition } from '../../utils/make-position';

interface Props {
  debt: BigNumber;
  depositSumUsd: number;
  onClose: () => void;
  tokenName: SupportedTokenName;
  onSend: (value: PositionCell) => void;
  debtSumUsd: number;
}

export function BorrowDecreaseModal({
  depositSumUsd,
  debt,
  onClose,
  tokenName,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('');

  const tokenInfo = useTokenInfo(tokenName);
  const currencyRates = useContextSelector(CurrencyRatesContext, (state) => state.currencyRates);

  const minimumRequired = currencyRates ? Number(currencyRates[tokenName.toUpperCase()]) * 10 : 0;

  const maximumPart = debt.toNumber() - minimumRequired;

  const inputDebtUsd = Number(value) / tokenInfo.priceInUsd;
  const actualDebtUsd = Math.max(debtSumUsd - inputDebtUsd, 0);

  const { health, healthDelta, borrowCapacityInterface, borrowCapacityDelta } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDepositUsd: depositSumUsd,
    debtUsd: debtSumUsd,
    actualDebtUsd,
  });

  const debtError = Number(debt) < Math.floor(+value);

  const isDebtMinimumRequired = actualDebtUsd >= 10 || actualDebtUsd === 0;

  const isButtonDisabled =
    !isDebtMinimumRequired ||
    debtError ||
    getRequiredError({ value, valueDecimals: tokenInfo.decimals });

  const getTokenByTokenName = useGetTokenByTokenName();
  const token = getTokenByTokenName(tokenName);
  const sendValue = makePosition(tokenName, value);
  const tokenSymbol = token?.symbol;

  return (
    <LiquidityModal
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={-inputDebtUsd}
          healthDelta={healthDelta}
          debtError={debtError}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to pay off"
        buttonProps={{
          label: `Pay off ${formatCompactCryptoCurrency(value)} ${tokenSymbol}`,
          onClick: () => onSend(sendValue),
          disabled: isButtonDisabled,
        }}
      >
        <TokenSuperField
          initFocus
          onChange={setValue}
          tokenSymbol={tokenSymbol}
          value={value}
          title={
            maximumPart ? `Up to ${maximumPart.toFixed(2)} to pay off partially` : 'To pay off'
          }
          badgeValue={debt.toString(10)}
        />
      </FormLayout>
    </LiquidityModal>
  );
}
