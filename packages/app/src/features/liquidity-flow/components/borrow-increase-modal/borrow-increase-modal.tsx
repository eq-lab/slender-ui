import React, { useEffect, useState } from 'react';
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens';
import { useAvailableToBorrow } from '@/entities/token/hooks/use-available-to-borrow';
import { useContextSelector } from 'use-context-selector';
import { CurrencyRatesContext } from '@/entities/currency-rates/context/context';
import { PositionSummary } from '@/entities/position/components/position-summary';
import cn from 'classnames';
import { Error } from '@marginly/ui/constants/classnames';
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name';
import BigNumber from 'bignumber.js';
import { TokenSuperField } from '@/shared/components/token-super-field';
import { formatCompactCryptoCurrency } from '@/shared/formatters';
import { useTokenInfo } from '../../hooks/use-token-info';
import { LiquidityModal } from '../modal/liquidity-modal';
import { getPositionInfo } from '../../utils/get-position-info';
import { FormLayout } from '../form-layout';
import { PositionUpdate } from '../../types';
import { AddAssetButton } from '../add-asset-button';
import { AssetSelect } from '../asset-select';
import { InputLayout } from '../../styled';
import { getMaxDebt } from '../../utils/get-max-debt';
import { getExtraTokenName } from '../../utils/get-extra-token-name';
import { getRequiredError } from '../../utils/get-required-error';
import { useGetAssetsInfo } from '../../hooks/use-get-assets-info';
import { useMinDebtUsd } from './use-min-debt-usd';

interface Props {
  debtSumUsd: number;
  depositSumUsd: number;
  onClose: () => void;
  tokenName: SupportedTokenName;
  onSend: (value: PositionUpdate) => void;
  debtTokenNames: SupportedTokenName[];
}

export function BorrowIncreaseModal({
  depositSumUsd,
  onClose,
  tokenName,
  onSend,
  debtTokenNames,
  debtSumUsd,
}: Props) {
  const [value, setValue] = useState('');
  const [extraValue, setExtraValue] = useState('');

  const [coreDebtTokenName, setCoreDebtTokenName] = useState<SupportedTokenName>(tokenName);
  const [showExtraInput, setShowExtraInput] = useState(false);

  const extraDebtTokenName = getExtraTokenName(debtTokenNames, coreDebtTokenName);

  const { availableToBorrow: coreAvailableToBorrow } = useAvailableToBorrow(
    tokenContracts[coreDebtTokenName],
  );
  const { availableToBorrow: extraAvailableToBorrow } = useAvailableToBorrow(
    tokenContracts[extraDebtTokenName ?? coreDebtTokenName],
  );

  const coreDebtInfo = useTokenInfo(coreDebtTokenName);
  const extraDebtInfo = useTokenInfo(extraDebtTokenName as SupportedTokenName);

  const assetsInfo = useGetAssetsInfo(debtTokenNames);

  const inputDebtSumUsd =
    Number(value) / coreDebtInfo.priceInUsd + Number(extraValue) / extraDebtInfo.priceInUsd;

  const actualDebtUsd = debtSumUsd + inputDebtSumUsd;

  const {
    borrowCapacityDelta,
    borrowCapacityInterface,
    borrowCapacityError,
    defaultBorrowCapacity,
    health,
    healthDelta,
  } = getPositionInfo({
    depositUsd: depositSumUsd,
    actualDepositUsd: depositSumUsd,
    debtUsd: debtSumUsd,
    actualDebtUsd,
  });

  const hasExtraDeptToken = Boolean(debtTokenNames[1]);

  const coreInputMax = getMaxDebt(
    coreAvailableToBorrow,
    defaultBorrowCapacity,
    coreDebtInfo.priceInUsd,
  );

  const extraInputMax =
    extraDebtTokenName &&
    getMaxDebt(extraAvailableToBorrow, defaultBorrowCapacity, extraDebtInfo.priceInUsd);

  const coreInputError = Number(value) > coreInputMax;
  const extraInputError = Number(extraValue) > (extraInputMax || 0);

  const getTokenByTokenName = useGetTokenByTokenName();
  const coreToken = getTokenByTokenName(coreDebtTokenName);
  const coreTokenSymbol = coreToken?.symbol;
  const extraToken = getTokenByTokenName(extraDebtTokenName);
  const extraTokenSymbol = extraToken?.symbol;

  const minDebtUsd = useMinDebtUsd();

  const currencyRates = useContextSelector(CurrencyRatesContext, (state) => state.currencyRates);
  const coreCurrencyRate = Number(currencyRates?.[coreDebtTokenName.toUpperCase() || '']);
  const extraCurrencyRate = Number(currencyRates?.[extraDebtTokenName?.toUpperCase() || '']);

  const minimumRequired = coreCurrencyRate * minDebtUsd;
  const extraMinimumRequired = extraCurrencyRate * minDebtUsd;

  const isDebtBiggerThanMinimum = Number(value) >= minimumRequired;

  const isExtraDebtBiggerThanMinimum = showExtraInput
    ? Number(extraValue) >= extraMinimumRequired
    : true;

  const isButtonDisabled =
    !isExtraDebtBiggerThanMinimum ||
    !isDebtBiggerThanMinimum ||
    borrowCapacityError ||
    coreInputError ||
    extraInputError ||
    getRequiredError({
      value,
      valueDecimals: coreDebtInfo.decimals,
      showExtraInput,
      extraValue,
      extraValueDecimals: extraDebtInfo.decimals,
    });

  const getSaveData = (): PositionUpdate => {
    const core = {
      [coreDebtTokenName]: BigNumber(value),
    };

    if (showExtraInput && extraDebtTokenName) {
      return {
        ...core,
        [extraDebtTokenName]: BigNumber(value),
      };
    }

    return core;
  };

  const description = showExtraInput
    ? undefined
    : `${formatCompactCryptoCurrency(
        coreAvailableToBorrow,
      )} ${coreTokenSymbol} available to borrow`;

  useEffect(() => {
    setCoreDebtTokenName(tokenName);
  }, [tokenName]);

  return (
    <LiquidityModal
      infoSlot={
        <PositionSummary
          debtUsd={actualDebtUsd}
          borrowCapacityDelta={borrowCapacityDelta}
          borrowCapacity={borrowCapacityInterface}
          depositSumUsd={depositSumUsd}
          health={health}
          debtUsdDelta={inputDebtSumUsd}
          healthDelta={healthDelta}
          borrowCapacityError={borrowCapacityError}
        />
      }
      onClose={onClose}
    >
      <FormLayout
        title="How much to borrow"
        description={description}
        buttonProps={{
          label: `Borrow`,
          onClick: () => onSend(getSaveData()),
          disabled: isButtonDisabled,
        }}
      >
        <InputLayout>
          <TokenSuperField
            initFocus
            onChange={setValue}
            value={value}
            title={minimumRequired ? `Min ${minimumRequired.toFixed(2)} to borrow` : 'To borrow'}
            badgeValue={coreInputMax.toString(10)}
            tokenSymbol={coreTokenSymbol}
            className={cn(coreInputError && Error)}
          >
            {!showExtraInput && hasExtraDeptToken && assetsInfo.length > 1 && (
              <AssetSelect
                onChange={setCoreDebtTokenName}
                assetsInfo={assetsInfo}
                value={coreDebtTokenName}
                tooltipText="Debt Asset"
              />
            )}
          </TokenSuperField>
        </InputLayout>

        {!showExtraInput && hasExtraDeptToken && (
          <AddAssetButton onClick={() => setShowExtraInput(true)} />
        )}

        {showExtraInput && (
          <TokenSuperField
            onChange={setExtraValue}
            value={extraValue}
            title={
              extraMinimumRequired
                ? `Min ${extraMinimumRequired.toFixed(2)} to borrow`
                : 'To borrow'
            }
            badgeValue={extraInputMax?.toString(10) ?? ''}
            tokenSymbol={extraTokenSymbol}
            className={cn(extraInputError && Error)}
          />
        )}
      </FormLayout>
    </LiquidityModal>
  );
}
