'use client';

import styled from 'styled-components';
import LabelUnstyled from '@marginly/ui/components/label';

export const Wrapper = styled.div`
  position: fixed;
  z-index: 50;
  top: 20px;
  left: 0;
  width: 100%;
  padding: 0 64px;
`;

export const Inner = styled.div`
  max-width: 1472px;
  margin: 0 auto;
  height: 56px;
  backdrop-filter: blur(12px);
  display: flex;
  padding: 0 4px 0 20px;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px;
  background: var(--fill-secondary);
`;

export const Label = styled(LabelUnstyled)`
  &&& {
    padding: 12px 8px;
  }
`;
