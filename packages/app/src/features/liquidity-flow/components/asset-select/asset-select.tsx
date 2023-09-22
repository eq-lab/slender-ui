import { useState } from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { SupportedToken, tokenContracts } from '@/shared/stellar/constants/tokens'
import { ReactComponent as CheckIcon } from '@/shared/icons/check.svg'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import * as S from './styled'
import { AddAssetButton } from '../add-asset-button'

interface Props {
  tokenNames: SupportedToken[]
  onChange: (value: SupportedToken) => void
  value?: SupportedToken
}

export function AssetSelect({ tokenNames, onChange, value }: Props) {
  const depositBalances = useGetBalance(
    tokenNames.map((tokenName) => tokenContracts[tokenName].address),
  )
  const getTokenByTokenName = useGetTokenByTokenName()
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

  const renderButton = () => {
    if (!value) {
      return <AddAssetButton onClick={handleClick} />
    }
    const ButtonIcon = getIconByTokenName(value)
    return (
      <S.ThumbnailWrapper md rectangle onClick={handleClick}>
        <ButtonIcon />
      </S.ThumbnailWrapper>
    )
  }

  return (
    <div>
      {renderButton()}
      <Menu anchorEl={anchorEl} open={open} onClose={close}>
        {tokenNames.map((tokenName, index) => {
          const token = getTokenByTokenName(tokenName)
          if (!token) return null
          const { name, symbol, decimals } = token
          const Icon = getIconByTokenName(tokenName)
          return (
            <MenuItem onClick={handleItemClick(tokenName)} key={tokenName}>
              <S.MenuItemInner>
                <S.ThumbnailWrapper rectangle md>
                  <Icon />
                </S.ThumbnailWrapper>
                <div>
                  <div>{name}</div>
                  {Number(depositBalances[index]?.balance ?? 0) / 10 ** decimals} {symbol}
                </div>
                {tokenName === value && <CheckIcon width={24} />}
              </S.MenuItemInner>
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}
