import styled from 'styled-components';

import { TRANSITION_CLASS_NAME } from './constants';

export const Wrapper = styled.div`
  &.${TRANSITION_CLASS_NAME}-enter-done, &.${TRANSITION_CLASS_NAME}-exit-done {
    transition: 300ms ease-in-out;
  }
  &.${TRANSITION_CLASS_NAME}-enter, &.${TRANSITION_CLASS_NAME}-exit {
    opacity: 0;
  }
`;
