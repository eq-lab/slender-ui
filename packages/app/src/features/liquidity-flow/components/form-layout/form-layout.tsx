import React from 'react';
import Typography from '@marginly/ui/components/typography';
import Button from '@marginly/ui/components/button';
import * as S from './styled';

interface Props {
  title: string;
  children: React.ReactNode;
  buttonProps: {
    onClick: () => void;
    disabled?: boolean;
    label: string;
  };
  description?: string;
}

export function FormLayout({ title, children, buttonProps, description }: Props) {
  return (
    <S.Wrapper>
      <S.Typography headerL>{title}</S.Typography>
      <S.Inner>{children}</S.Inner>
      <S.BottomSection>
        <Button lg onClick={buttonProps.onClick} disabled={buttonProps.disabled} fullWidth>
          {buttonProps.label}
        </Button>
        {description && (
          <Typography caption secondary>
            {description}
          </Typography>
        )}
      </S.BottomSection>
    </S.Wrapper>
  );
}
