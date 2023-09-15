import { SupportedToken } from '@/shared/stellar/constants/tokens'

export type PositionUpdate = Partial<Record<SupportedToken, bigint>>
