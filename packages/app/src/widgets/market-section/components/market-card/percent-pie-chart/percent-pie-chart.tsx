import Typography from '@marginly/ui/components/typography';
import { PieChartWrapper } from './styled';

export function PercentPieChart({ percent = 0 }: { percent?: number }) {
  return (
    <PieChartWrapper $percent={percent}>
      <Typography caption className="percent">
        {percent}%
      </Typography>
    </PieChartWrapper>
  );
}
