import { MouseEvent, useState } from 'react'
import { SupportedTokenName, tokenContracts } from '@/shared/stellar/constants/tokens'
import { ReactComponent as CheckIcon } from '@/shared/icons/check.svg'
import { useGetBalance } from '@/entities/token/hooks/use-get-balance'
import { useGetTokenByTokenName } from '@/entities/token/hooks/use-get-token-by-token-name'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import Button from '@marginly/ui/components/button'
import * as S from './styled'
import { AddAssetButton } from '../add-asset-button'

interface Props {
  tokenNames: SupportedTokenName[]
  onChange: (value: SupportedTokenName) => void
  value?: SupportedTokenName
  isDeposit?: boolean
}

export function AssetSelect({ tokenNames, onChange, value, isDeposit }: Props) {
  const depositBalances = useGetBalance(
    tokenNames.map((tokenName) => tokenContracts[tokenName].address),
  )
  const getTokenByTokenName = useGetTokenByTokenName()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const close = () => {
    setAnchorEl(null)
  }
  const handleItemClick = (itemValue: SupportedTokenName) => () => {
    onChange(itemValue)
    close()
  }

  const renderButton = () => {
    if (!value) {
      return <AddAssetButton onClick={handleClick} />
    }
    const ButtonIcon = getIconByTokenName(value)
    return (
      <Button md onClick={handleClick} secondary icon>
        <ButtonIcon width={24} />
      </Button>
    )
  }

  return (
    <div>
      {renderButton()}
      <S.Menu anchorEl={anchorEl} open={open} onClose={close}>
        {tokenNames.map((tokenName, index) => {
          const token = getTokenByTokenName(tokenName)
          const tokenBalance = depositBalances[index]?.balance.toNumber() || 0
          if (!token || (!tokenBalance && isDeposit)) return null
          const { title, symbol } = token
          const Icon = getIconByTokenName(tokenName)
          return (
            <S.MenuItem onClick={handleItemClick(tokenName)} key={tokenName}>
              <S.MenuItemInner>
                <S.ThumbnailWrapper rectangle md>
                  <Icon />
                </S.ThumbnailWrapper>
                <div>
                  <div>{title}</div>
                  {tokenBalance} {symbol}
                </div>
                {tokenName === value && <CheckIcon width={24} />}
              </S.MenuItemInner>
            </S.MenuItem>
          )
        })}
      </S.Menu>
    </div>
  )
}
