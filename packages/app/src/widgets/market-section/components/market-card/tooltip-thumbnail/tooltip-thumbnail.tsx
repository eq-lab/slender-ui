import React from 'react';
import Thumbnail from '@marginly/ui/components/thumbnail';
import { Tooltip } from '@/shared/components/tooltip';
import { ThumbnailWrapper, InfoIcon } from './styled';

export function TooltipThumbnail({
  withThumbnail,
  children,
}: {
  withThumbnail?: boolean;
  children: React.ReactNode;
}) {
  const renderTooltipIcon = () => {
    if (withThumbnail)
      return (
        <ThumbnailWrapper>
          <Thumbnail md>
            <InfoIcon />
          </Thumbnail>
        </ThumbnailWrapper>
      );
    return <InfoIcon />;
  };

  return (
    <Tooltip content={children} placement="top">
      {renderTooltipIcon()}
    </Tooltip>
  );
}
