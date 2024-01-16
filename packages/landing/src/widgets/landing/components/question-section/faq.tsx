'use client';

import React from 'react';
import { ReactComponent as ArrowUp } from '@slender/shared/icons/arrow-up.svg';
import cn from 'classnames';
import Typography from '@marginly/ui/components/typography';
import { Wrapper, FaqHeader, Section } from './faq.styled';

export function Faq({ title, children }: { title: string; children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Wrapper onClick={() => setIsExpanded(!isExpanded)}>
      <FaqHeader className={cn({ expanded: isExpanded })}>
        <Typography headerS>{title}</Typography>
        <ArrowUp width={24} />
      </FaqHeader>
      {isExpanded && <Section>{children}</Section>}
    </Wrapper>
  );
}
