import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { ResponsiveContainer, ComposedChart, Bar, CartesianGrid, Cell, Line, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from '../shared/EmptyState'
import { formatDate, formatMoney } from '../../lib/formatters'
import { buildCurrentCycleTrendData } from './data'

export default function CurrentMonthTrendsSection({ cycleReport, cycleTransactions }) {
    if (!cycleReport && cycleTransactions.length === 0) {
        return (
            <section className="panel current-month-trends-panel">
                <EmptyState message="No current-cycle transactions are available yet." />
            </section>
        )
    }

    const {
        currentWeekLabel,
        cycleBudget,
        cycleRemaining,
        cycleSpent,
        weekAvailable,
        weekChartData,
        weekRemaining,
        weekSpent,
    } = buildCurrentCycleTrendData({
        currentCycleReport: cycleReport,
        currentCycleTransactions: cycleTransactions,
    })
    const summaryCards = [
        {
            label: `Week ${currentWeekLabel}`,
            tone: weekRemaining < 0 ? 'accent' : '',
            value: formatMoney(weekRemaining),
            note: `of ${formatMoney(weekAvailable)}`,
        },
        {
            label: 'Budget left this cycle',
            note: `Budget: ${formatMoney(cycleBudget)} · Spent: ${formatMoney(cycleSpent)}`,
            tone: cycleRemaining < 0 ? 'accent' : 'secondary',
            value: formatMoney(cycleRemaining),
        },
    ]

    return (
        <section className="panel current-month-trends-panel">
            <Box className="current-month-summary-grid">
                {summaryCards.map((metric) => (
                    <Paper key={metric.label} sx={{ p: 2 }} elevation={0} className="metric-card current-month-summary-card">
                        <Typography variant="caption" className="metric-label">{metric.label}</Typography>
                        <Typography variant="h6" className={`metric-value ${metric.tone}`.trim()}>{metric.value}</Typography>
                        <Typography variant="body2" className="section-note">{metric.note}</Typography>
                    </Paper>
                ))}
            </Box>

            <div className="current-month-chart-shell">
                <div className="current-month-chart-frame">
                    <ResponsiveContainer width="100%" height={280}>
                        <ComposedChart data={weekChartData} margin={{ top: 16, right: 16, left: 24, bottom: 24 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis tickFormatter={(value) => formatMoney(value)} />
                            <Tooltip
                                formatter={(value, name) => [
                                    formatMoney(value),
                                    name === 'availableBudget' ? 'Weekly available budget' : 'Spent',
                                ]}
                                labelFormatter={(label, payload) => {
                                    const point = payload?.[0]?.payload

                                    return point ? `Week ${label} (${point.from} to ${point.to})` : label
                                }}
                            />
                            <Bar dataKey="totalSpent" radius={[6, 6, 0, 0]}>
                                {weekChartData.map((week) => (
                                    <Cell
                                        key={`${week.from}-${week.to}`}
                                        fill={week.isCurrent ? '#2f7a73' : '#3f6aa0'}
                                    />
                                ))}
                            </Bar>
                            <Line
                                type="monotone"
                                dataKey="availableBudget"
                                name="Weekly available budget"
                                stroke="#f4a261"
                                strokeWidth={3}
                                dot={{ fill: '#f4a261', r: 4, strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    )
}
