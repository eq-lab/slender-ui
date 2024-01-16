import React from 'react';
import { CSSTransition } from 'react-transition-group';
import * as S from './styled';
import { TRANSITION_CLASS_NAME } from './constants';

const TRANSITION_TIMEOUT_MS = 300;
interface Props {
  inTransition: boolean;
  children?: React.ReactNode;
}

export function OpacityCssTransition({ inTransition, children }: Props) {
  return (
    <CSSTransition
      in={inTransition}
      timeout={TRANSITION_TIMEOUT_MS}
      classNames={TRANSITION_CLASS_NAME}
    >
      <S.Wrapper>{children}</S.Wrapper>
    </CSSTransition>
  );
}
