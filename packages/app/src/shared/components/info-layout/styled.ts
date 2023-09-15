import styled from 'styled-components'

export const Wrapper = styled.div`
  width: 320px;
  padding: 24px;
  background-color: var(--fill-secondary);
  border-radius: 24px;
  grid-template-columns: 100%;
  display: grid;
  gap: 24px;
  justify-items: center;
`

export const Title = styled.p`
  font-variation-settings: 'wght' 700;
  font-size: 20px;
  text-align: center;
`

export const List = styled.div`
  display: grid;
  gap: 16px;
`
