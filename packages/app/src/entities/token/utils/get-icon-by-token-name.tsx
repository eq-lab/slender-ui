import { ReactComponent as LumenIcon } from '@/shared/icons/tokens/lumen.svg'
import { ReactComponent as RippleIcon } from '@/shared/icons/tokens/ripple.svg'
import { ReactComponent as UsdcIcon } from '@/shared/icons/tokens/usdc.svg'
import { SupportedToken } from '@/shared/stellar/constants/tokens'

export const getIconByTokenName = (tokenName: SupportedToken) => {
  const iconByToken = {
    usdc: UsdcIcon,
    xlm: LumenIcon,
    xrp: RippleIcon,
  }
  return iconByToken[tokenName]
}
