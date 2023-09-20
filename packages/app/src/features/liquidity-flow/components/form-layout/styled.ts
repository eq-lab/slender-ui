import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 352px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`

export const Inner = styled.div`
  display: grid;
  grid-template-columns: 100%;
  gap: 32px;
`

export const Button = styled.button`
  display: flex;
  height: 64px;
  padding: 0 48px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 16px;
  color: white;
  width: 100%;
  background: var(--fill-primary);
  cursor: pointer;
  &:disabled {
    opacity: 0.24;
    cursor: auto;
  }
`

export const BottomSection = styled.div`
  display: grid;
  gap: 16px;
  margin-top: auto;
  justify-items: center;
`
