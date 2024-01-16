import { getIconByTokenName } from '@/entities/token/utils/get-icon-by-token-name';
import { colorByToken } from '@/entities/token/constants/token-colors';
import { SupportedTokenName } from '@/shared/stellar/constants/tokens';
import { Thumbnail } from './styled';

interface Props {
  tokenName: SupportedTokenName;
}

export function TokenThumbnail({ tokenName }: Props) {
  const Icon = getIconByTokenName(tokenName);
  const thumbnailBackgroundColor = colorByToken[tokenName];

  return (
    <Thumbnail xl darkbg $backgroundColor={thumbnailBackgroundColor}>
      <Icon />
    </Thumbnail>
  );
}
