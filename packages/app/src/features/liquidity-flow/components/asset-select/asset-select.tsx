import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { ReactComponent as CheckIcon } from '@/shared/icons/check.svg'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useGetInfoByTokenName } from '@/entities/token/hooks/use-get-info-by-token-name'
import * as uiClassNames from '@marginly/ui/constants/classnames'
import cn from 'classnames'
import { getIconByToken } from '@/entities/token/utils/get-icon-by-token'
import * as S from './styled'

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

  const ButtonIcon = getIconByToken(value)
  return (
    <div>
      <S.ThumbnailWrapper
        className={cn(uiClassNames.M, uiClassNames.Rectangle)}
        onClick={handleClick}
      >
        <ButtonIcon />
      </S.ThumbnailWrapper>
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        {tokens.map((token, index) => {
          const tokenInfo = getInfoByTokenName(token)
          if (!tokenInfo) return null
          const { name, symbol, decimals } = tokenInfo
          const Icon = getIconByToken(token)
          return (
            <MenuItem onClick={handleItemClick(token)} key={token}>
              <S.MenuItemInner>
                <S.ThumbnailWrapper className={cn(uiClassNames.M, uiClassNames.Rectangle)}>
                  <Icon />
                </S.ThumbnailWrapper>
                <div>
                  <div>{name}</div>
                  {Number(depositBalances[index]?.balance ?? 0) / 10 ** decimals} {symbol}
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
