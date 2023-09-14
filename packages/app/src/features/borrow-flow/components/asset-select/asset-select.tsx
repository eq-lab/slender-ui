import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { ReactComponent as RippleIcon } from '@/shared/icons/tokens/ripple.svg'
import { ReactComponent as LumenIcon } from '@/shared/icons/tokens/lumen.svg'
import { ReactComponent as UsdcIcon } from '@/shared/icons/tokens/usdc.svg'
import { ReactComponent as CheckIcon } from '@/shared/icons/check.svg'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useGetInfoByTokenName } from '@/entities/token/hooks/use-get-info-by-token-name'
import * as S from './styled'

const iconByToken: Record<SupportedToken, React.ReactNode> = {
  usdc: <UsdcIcon />,
  xlm: <LumenIcon />,
  xrp: <RippleIcon />,
}

interface Props {
  tokens: SupportedToken[]
  onChange: (value: SupportedToken) => void
  value: SupportedToken
}

export function AssetSelect({ tokens, onChange, value }: Props) {
  const depositBalances = useGetBalance(
    tokens.map((tokenName) => tokenContracts[tokenName].address),
  )
  const getInfoByTokenName = useGetInfoByTokenName()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const close = () => {
    setAnchorEl(null)
  }
  const handleItemClick = (itemValue: SupportedToken) => () => {
    onChange(itemValue)
    close()
  }

  return (
    <div>
      <S.IconWrapper onClick={handleClick}>{iconByToken[value]}</S.IconWrapper>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        {tokens.map((token, index) => {
          const tokenInfo = getInfoByTokenName(token)
          return (
            <MenuItem onClick={handleItemClick(token)} key={token}>
              <S.MenuItemInner>
                <S.IconWrapper>{iconByToken[token]}</S.IconWrapper>
                <div>
                  <div>{tokenInfo?.name}</div>
                  {depositBalances[index]?.balance ?? 0} {tokenInfo?.symbol}
                </div>
                {token === value && <CheckIcon width={24} />}
              </S.MenuItemInner>
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}
