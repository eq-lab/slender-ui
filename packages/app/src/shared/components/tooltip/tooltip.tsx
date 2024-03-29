import React, { ReactNode } from 'react';
import TooltipUi, { TooltipProps } from '@mui/material/Tooltip';
import * as S from './styled';

export function Tooltip({
  children,
  content,
  placement,
}: {
  children: ReactNode;
  content: ReactNode;
  placement?: TooltipProps['placement'];
}) {
  return (
    <S.GeneratePopperClassName>
      {(popperClassName) => (
        <TooltipUi
          title={content}
          arrow
          classes={{ popper: popperClassName }}
          placement={placement}
        >
          <div>{children}</div>
        </TooltipUi>
      )}
    </S.GeneratePopperClassName>
  );
}
