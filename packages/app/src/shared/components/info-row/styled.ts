import styled from 'styled-components'

export const Wrapper = styled.div<{ $error?: boolean }>`
  display: flex;
  gap: 16px;
  color: ${({ $error }) => $error && 'red'};
  justify-content: space-between;
`

export const ValueSection = styled.div`
  display: grid;
  align-items: center;
  justify-items: end;
`
