import styled from 'styled-components'

export const Wrapper = styled.div`
  min-width: 352px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`

export const Title = styled.span`
  font-size: 32px;
  font-variation-settings: 'wght' 700;
  line-height: 40px;
`

export const Inner = styled.div`
  display: grid;
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

export const Description = styled.span`
  color: var(--text-secondary);
  font-size: 12px;
  line-height: normal;
`
