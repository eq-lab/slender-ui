import { MouseEvent, useState } from 'react'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import { ReactComponent as CheckIcon } from '@/shared/icons/check.svg'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import Button from '@marginly/ui/components/button'
import { AssetInfo } from '../../hooks/use-get-assets-info'
import * as S from './styled'
import { AddAssetButton } from '../add-asset-button'

interface Props {
  assetsInfo: AssetInfo[]
  onChange: (value: SupportedTokenName) => void
  value?: SupportedTokenName
}

export function AssetSelect({ assetsInfo, onChange, value }: Props) {
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
      <Button md elevated onClick={handleClick} icon>
        <ButtonIcon width={24} />
      </Button>
    )
  }

  return (
    <S.ButtonWrapper>
      {renderButton()}
      <S.Menu anchorEl={anchorEl} open={open} onClose={close}>
        {assetsInfo.map(({ tokenName, tokenBalance, title, symbol, Icon }) => (
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
        ))}
      </S.Menu>
    </S.ButtonWrapper>
  )
}
