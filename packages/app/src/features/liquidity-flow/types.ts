import { SupportedTokenName } from '@/shared/stellar/constants/tokens'

export type PositionUpdate = Partial<Record<SupportedTokenName, bigint>>
