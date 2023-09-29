import React from 'react'
import styled from 'styled-components'

interface ClassNameConsumerProps {
  className?: string
  children: (className?: string) => React.ReactElement
}

const ClassNameConsumer = ({ className, children }: ClassNameConsumerProps) => children(className)

export const GeneratePopperClassName = styled(ClassNameConsumer)`
  && {
    .MuiTooltip-tooltip {
      padding: var(--spacing-space-12);
      background: var(--fill-primary);
      border-radius: var(--rounding-radius-s, 12px);
    }
    .MuiTooltip-arrow {
      color: var(--fill-primary);
    }
  }
`
