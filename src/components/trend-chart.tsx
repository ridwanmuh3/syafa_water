import type { CSSProperties } from 'react'
import type { MonthlyTrendPoint } from '~/lib/transactions'

export function TrendChart({ points }: { points: Array<MonthlyTrendPoint> }) {
  const maxValue = Math.max(
    1,
    ...points.flatMap((point) => [point.revenue, point.cost]),
  )

  return (
    <div
      className="trend-chart"
      style={{ '--bars': points.length || 1 } as CSSProperties}
    >
      {points.map((point) => (
        <div className="trend-group" key={point.label}>
          <div className="trend-bars">
            <div
              className="trend-bar revenue"
              style={{ '--height': `${Math.max(2, (point.revenue / maxValue) * 100)}%` } as CSSProperties}
              title={`Pendapatan ${point.label}`}
            />
            <div
              className="trend-bar cost"
              style={{ '--height': `${Math.max(2, (point.cost / maxValue) * 100)}%` } as CSSProperties}
              title={`Biaya ${point.label}`}
            />
          </div>
          <div className="trend-label">{point.label}</div>
        </div>
      ))}
    </div>
  )
}
