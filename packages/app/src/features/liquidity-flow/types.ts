import { SupportedTokenName } from '@/shared/stellar/constants/tokens';
import BigNumber from 'bignumber.js';

export type PositionUpdate = Partial<Record<SupportedTokenName, BigNumber>>;
