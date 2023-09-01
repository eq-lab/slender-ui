import { SupportedToken } from '@/shared/stellar/constants/tokens'

interface Collateral {
  type: SupportedToken
  value: number
}
export interface DebtInfo {
  debt: number
  debtType: SupportedToken
}

export interface Position extends DebtInfo {
  collaterals: [Collateral, Collateral | null]
}
