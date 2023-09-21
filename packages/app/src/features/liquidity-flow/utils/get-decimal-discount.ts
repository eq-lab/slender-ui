import { PERCENT_PRECISION } from '@/entities/token/constants/contract-constants'

export const getDecimalDiscount = (discount: number) => discount / PERCENT_PRECISION
