import { ReactComponent as InfoIcon } from './info.svg'
import { Thumbnail } from './styled'

export function Tooltip({ withThumbnail }: { withThumbnail?: boolean }) {
  if (withThumbnail)
    return (
      <Thumbnail md darkbg>
        <InfoIcon />
      </Thumbnail>
    )

  return <InfoIcon />
}
