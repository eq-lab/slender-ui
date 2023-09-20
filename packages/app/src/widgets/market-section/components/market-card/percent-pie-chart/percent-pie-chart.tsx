import { PieChartWrapper } from './styled'

export function PercentPieChart({ percent = 0 }: { percent?: number }) {
  return <PieChartWrapper $percent={percent}>{percent}%</PieChartWrapper>
}
