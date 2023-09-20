import styled from 'styled-components'

export const Wrapper = styled.div<{ $error?: boolean }>`
  display: flex;
  min-height: 48px;
  gap: 16px;
  color: ${({ $error }) => $error && 'var(--text-negative)'};
  justify-content: space-between;
  align-items: center;
`

export const ValueSection = styled.div`
  display: grid;
  align-items: center;
  justify-items: end;
`
export const SubValue = styled.div`
  font-size: 12px;
  color: var(--text-secondary);
`
