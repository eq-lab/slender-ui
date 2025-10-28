import React, { useState } from 'react';
import { SupportedTokenName } from '@/shared/stellar/constants/tokens';

import { PositionCell } from '@/entities/position/types';
import { PositionSummary } from '@/entities/position/components/position-summary';
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name';
import BigNumber from 'bignumber.js';
import { formatCompactCryptoCurrency } from '@/shared/formatters';
import { TokenSuperField } from '@/shared/components/token-super-field';
import { useTokenInfo } from '../../hooks/use-token-info';
import { LiquidityModal } from '../modal/liquidity-modal';
import { getPositionInfo } from '../../utils/get-position-info';
import { FormLayout } from '../form-layout';
import { getDepositUsd } from '../../utils/get-deposit-usd';
import { getRequiredError } from '../../utils/get-required-error';
import { makePosition } from '../../utils/make-position';

interface Props {
  deposit: BigNumber;
  depositSumUsd: number;
  onClose: () => void;
  tokenName: SupportedTokenName;
  onSend: (value: PositionCell) => void;
  debtSumUsd: number;
}

export function LendDecreaseModal({
  depositSumUsd,
  deposit,
  onClose,
  tokenName,
  onSend,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('');

  const depositTokenInfo = useTokenInfo(tokenName);

  console.log('deposit', deposit.toString());
  console.log('value', value);
  const inputDepositSumUsd = getDepositUsd(
    value,
    depositTokenInfo.priceInUsd,
    depositTokenInfo.discount,
  );

  const actualDepositUsd = Math.max(depositSumUsd - inputDepositSumUsd, 0);

  const { borrowCapacityDelta, borrowCapacityInterface, borrowCapacityError, health, healthDelta } =
    getPositionInfo({
      depositUsd: depositSumUsd,
      actualDepositUsd,
      debtUsd: debtSumUsd,
      actualDebtUsd: debtSumUsd,
    });

  const depositError = Number(deposit) < Math.floor(+value);

  const formError =
    depositError ||
    borrowCapacityError ||
    getRequiredError({ value, valueDecimals: depositTokenInfo.decimals });

  const getTokenByTokenName = useGetTokenByTokenName();
  const token = getTokenByTokenName(tokenName);
  const tokenSymbol = token?.symbol;

  const positionUpdate = makePosition(tokenName, value);

  return (
    <LiquidityModal
      infoSlot={
        <PositionSummary
          debtUsd={debtSumUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={actualDepositUsd}
          collateralError={borrowCapacityError}
          health={health}
          healthDelta={healthDelta}
          depositSumUsdDelta={-inputDepositSumUsd}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="Withdraw collateral"
        description={
          formError ? "Can't withdraw, not enough collateral to cover the debt" : undefined
        }
        buttonProps={{
          label: `Withdraw ${formatCompactCryptoCurrency(value)} ${tokenSymbol}`,
          onClick: () => onSend(positionUpdate),
          disabled: formError,
        }}
      >
        <TokenSuperField
          initFocus
          onChange={setValue}
          value={value}
          title="To withdraw"
          badgeValue={deposit.toString(10)}
          tokenSymbol={tokenSymbol}
        />
      </FormLayout>
    </LiquidityModal>
  );
}
