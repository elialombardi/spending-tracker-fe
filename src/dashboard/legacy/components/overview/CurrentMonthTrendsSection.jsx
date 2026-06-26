import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import EmptyState from '../shared/EmptyState'
import { formatDate, formatMoney } from '../../lib/formatters'
import { buildCurrentCycleTrendData } from './data'

export default function CurrentMonthTrendsSection({ cycleReport, cycleTransactions }) {
    if (!cycleReport && cycleTransactions.length === 0) {
        return (
            <section className="panel current-month-trends-panel">
                <div className="section-heading">
                    <div>
                        <p className="eyebrow">Current cycle</p>
                        <h2>Track your cycle and week budget pace</h2>
                    </div>
                </div>

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
            label: 'Budget left this cycle',
            note: `Budget: ${formatMoney(cycleBudget)} · Spent: ${formatMoney(cycleSpent)}`,
            tone: cycleRemaining < 0 ? 'accent' : 'secondary',
            value: formatMoney(cycleRemaining),
        },
        {
            label: 'Budget left this week',
            note: `${currentWeekLabel} · Available this week: ${formatMoney(weekAvailable)}`,
            tone: weekRemaining < 0 ? 'accent' : '',
            value: formatMoney(weekRemaining),
        },
    ]

    return (
        <section className="panel current-month-trends-panel">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Current cycle</p>
                    <h2>Track your cycle and week budget pace</h2>
                    <p className="section-note">
                        Current cycle: {formatDate(cycleReport.from)} to {formatDate(cycleReport.to)}.
                        The week figure is the share of the remaining cycle budget allocated to the rest of this week.
                    </p>
                </div>
            </div>

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
                        <BarChart data={weekChartData} margin={{ top: 16, right: 16, left: 24, bottom: 24 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis tickFormatter={(value) => formatMoney(value)} />
                            <Tooltip
                                formatter={(value) => formatMoney(value)}
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
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>
    )
}
