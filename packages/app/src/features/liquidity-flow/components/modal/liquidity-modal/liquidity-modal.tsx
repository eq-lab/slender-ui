import React from 'react';
import { LiquidityModalLayout } from '../liquidity-modal-layout';
import { Modal } from '../modal';

interface Props {
  onClose: () => void;
  onBack?: () => void;
  children?: React.ReactNode;
  infoSlot?: React.ReactNode;
}

export function LiquidityModal({ onClose, onBack, children, infoSlot }: Props) {
  return (
    <Modal onClose={onClose} onBack={onBack} maxWidth="md" open>
      <LiquidityModalLayout infoSlot={infoSlot}>{children}</LiquidityModalLayout>
    </Modal>
  );
}
