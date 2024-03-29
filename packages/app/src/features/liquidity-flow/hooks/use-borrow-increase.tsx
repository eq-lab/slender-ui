import { useState } from 'react';
import { PositionContext } from '@/entities/position/context/context';
import { useContextSelector } from 'use-context-selector';
import { SupportedTokenName } from '@/shared/stellar/constants/tokens';
import BigNumber from 'bignumber.js';
import { excludeSupportedTokens } from '../utils/exclude-supported-tokens';
import { BorrowIncreaseModal } from '../components/borrow-increase-modal';
import { sumObj } from '../utils/sum-obj';
import { useDebtUsd } from './use-debt-usd';
import { useDepositUsd } from './use-deposit-usd';
import { PositionUpdate } from '../types';
import { useLiquidity } from './use-liquidity';
import { getCellByPositionUpdate } from '../soroban/get-cell-by-position-update';

export const useBorrowIncrease = (): {
  modal: JSX.Element | null;
  open: (value?: SupportedTokenName) => void;
} => {
  const position = useContextSelector(PositionContext, (state) => state.position);
  const [modalToken, setModalToken] = useState<SupportedTokenName | null>(null);

  const depositTokens = position?.deposits.map((deposit) => deposit.tokenName) || [];

  const depositSumUsd = useDepositUsd(position?.deposits);
  const debtSumUsd = useDebtUsd(position?.debts);
  const send = useLiquidity('borrow');

  const open = (value?: SupportedTokenName) => {
    if (value) {
      setModalToken(value);
      return;
    }
    const firstToken = excludeSupportedTokens(depositTokens)[0];
    if (firstToken) {
      setModalToken(firstToken);
    }
  };

  const renderModal = () => {
    if (!position || !modalToken) return null;

    const handleSend = async (sendValue: PositionUpdate) => {
      const prevDebtsObj = position.debts.reduce(
        (acc, el) => ({
          ...acc,
          [el.tokenName]: el.value,
        }),
        {},
      );
      const finalDebtsObj = sumObj(prevDebtsObj, sendValue);
      const debts = Object.entries(finalDebtsObj).map((entry) => {
        const [tokenName, value] = entry as [SupportedTokenName, BigNumber];
        return {
          tokenName,
          value,
        };
      });

      setModalToken(null);
      await send({
        additionalDebts: getCellByPositionUpdate(sendValue),
        debts,
      });
    };

    return (
      <BorrowIncreaseModal
        debtTokenNames={excludeSupportedTokens(depositTokens)}
        depositSumUsd={depositSumUsd}
        debtSumUsd={debtSumUsd}
        tokenName={modalToken}
        onClose={() => setModalToken(null)}
        onSend={handleSend}
      />
    );
  };

  return { modal: renderModal(), open };
};
