import React from 'react'
import { Tooltip } from '@/shared/components/tooltip'
import { ReactComponent as InfoIcon } from './info.svg'
import { Thumbnail } from './styled'

export function TooltipThumbnail({
  withThumbnail,
  children,
}: {
  withThumbnail?: boolean
  children: React.ReactElement
}) {
  const renderTooltipIcon = () => {
    if (withThumbnail)
      return (
        <Thumbnail md darkbg>
          <InfoIcon />
        </Thumbnail>
      )
    return <InfoIcon />
  }

  return (
    <Tooltip content={children} placement="top">
      {renderTooltipIcon()}
    </Tooltip>
  )
}
