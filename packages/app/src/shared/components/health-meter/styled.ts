import styled from 'styled-components'

export const HealthMeterContainer = styled.div`
  position: relative;
  width: 76px;
  height: 56px;
`

export const HealthTooltipContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  position: absolute;
  bottom: -15px;
  left: 14px;

  .health-text {
    color: var(--text-tertiary);
  }
`

export const HealthMeterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 50%;
  transform: rotate(165deg);
  width: 100%;
  height: 100%;
`

export const MeterDash = styled.i<{ index: number; shaded?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: rotate(calc(121deg + calc(calc(260deg / 45) * ${({ index }) => index})));
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 8px;
    transform: rotate(309deg);
    transform-origin: top;
    background: ${({ shaded }) =>
      shaded ? 'var(--icon-primary)' : 'var(--color-transparent-gray4)'};
  }
`

export const HealthPercentCountContainer = styled.div`
  top: 14px;
  left: 3px;
  position: absolute;
  width: 100%;
  text-align: center;
`
