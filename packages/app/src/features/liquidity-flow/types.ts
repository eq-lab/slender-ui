import { SupportedToken } from '@/shared/stellar/constants/tokens'

export type PositionUpdate = Partial<Record<SupportedToken, bigint>>
export interface PositionInput {
  depositUsd: number
  debtUsd: number
  actualDebtUsd: number
  actualDepositUsd: number
}
