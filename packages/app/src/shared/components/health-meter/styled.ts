import styled from 'styled-components'

export const HealthMeterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96px;
  height: 96px;
`

export const HealthMeterContainer = styled.div`
  position: relative;
  width: 76px;
  height: 56px;
`

export const MeterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  border-radius: 50%;
  transform: rotate(165deg);
  width: 100%;
  height: 100%;
`

export const HealthTooltipContainer = styled.div<{ $isRed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2px;
  position: absolute;
  bottom: -15px;
  margin-left: 2px;

  .health-text {
    color: var(${({ $isRed }) => ($isRed ? '--text-negative' : '--text-tertiary')});
  }

  svg {
    fill: var(${({ $isRed }) => ($isRed ? '--text-negative' : '--text-tertiary')});
  }
`

export const MeterDash = styled.i<{ index: number; $shaded: boolean; $isRed: boolean }>`
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
    background: ${({ $shaded, $isRed }) => {
      if (!$shaded) return 'var(--color-transparent-gray4)'
      return $isRed ? 'var(--icon-negative)' : 'var(--icon-primary)'
    }};
  }
`

export const HealthPercentCountContainer = styled.div<{ $isRed: boolean }>`
  top: 14px;
  left: 3px;
  position: absolute;
  width: 100%;
  text-align: center;

  .heath-count-text {
    color: var(${({ $isRed }) => ($isRed ? '--text-negative' : '--text-primary')});
  }
`
