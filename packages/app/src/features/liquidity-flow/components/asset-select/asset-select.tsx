import { MouseEvent, useState } from 'react'
import { colorByToken } from '@/entities/token/constants/token-colors'
import Typography from '@marginly/ui/components/typography'
import { Tooltip, TooltipText } from '@/shared/components/tooltip'
import { SupportedTokenName } from '@/shared/stellar/constants/tokens'
import { ReactComponent as CheckIcon } from '@/shared/icons/check.svg'
import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name'
import Button from '@marginly/ui/components/button'
import { formatCompactCryptoCurrency } from '@/shared/formatters'
import { AssetInfo } from '../../hooks/use-get-assets-info'
import * as S from './styled'
import { AddAssetButton } from '../add-asset-button'

interface Props {
  assetsInfo: AssetInfo[]
  onChange: (value: SupportedTokenName) => void
  value?: SupportedTokenName
  tooltipText: string
}

export function AssetSelect({ assetsInfo, onChange, value, tooltipText }: Props) {
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
      <Tooltip content={<TooltipText>{tooltipText}</TooltipText>} placement="top">
        <Button md elevated onClick={handleClick} icon>
          <ButtonIcon width={24} />
        </Button>
      </Tooltip>
    )
  }

  return (
    <S.ButtonWrapper>
      {renderButton()}
      <S.Menu anchorEl={anchorEl} open={open} onClose={close}>
        {assetsInfo.map(({ tokenName, tokenBalance, title, symbol, Icon }) => {
          const thumbnailBackgroundColor = colorByToken[tokenName]
          return (
            <S.MenuItem onClick={handleItemClick(tokenName)} key={tokenName}>
              <S.MenuItemInner>
                <S.ThumbnailWrapper
                  rectangle
                  md
                  darkbg
                  $thumbnailBackgroundColor={thumbnailBackgroundColor}
                >
                  <Icon />
                </S.ThumbnailWrapper>
                <S.MenuItemTextWrapper>
                  <Typography>{title}</Typography>
                  <Typography caption secondary>
                    {formatCompactCryptoCurrency(tokenBalance)} {symbol}
                  </Typography>
                </S.MenuItemTextWrapper>
                {tokenName === value && <CheckIcon width={24} />}
              </S.MenuItemInner>
            </S.MenuItem>
          )
        })}
      </S.Menu>
    </S.ButtonWrapper>
  )
}
