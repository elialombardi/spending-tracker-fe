import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import EmptyState from '../shared/EmptyState'
import SpendingComparison from '../SpendingComparison'
import { SPENDING_GRANULARITY_OPTIONS } from './data'

export default function SpendingPaceSection({
    comparisonCycleReports,
    comparisonChartData,
    comparisonChartScale,
    comparisonChartSeries,
    comparisonChartYTicks,
    onSpendingGranularityChange,
    spendingGranularity,
}) {
    return (
        <section className="panel spending-comparison-panel">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Spending pace</p>
                    <h2>Compare spend inside each cycle</h2>
                    <p className="section-note spending-comparison-note">
                        Outgoing spending is shown across the full cycle timeline. If the selected cycle is still in
                        progress, its line stops at the latest recorded bucket instead of dropping future periods to
                        zero.
                    </p>
                </div>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel id="spending-granularity-label">Group by</InputLabel>
                    <Select
                        labelId="spending-granularity-label"
                        value={spendingGranularity}
                        label="Group by"
                        onChange={(event) => onSpendingGranularityChange(event.target.value)}
                    >
                        {SPENDING_GRANULARITY_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>

            {comparisonCycleReports.length === 0 ? (
                <EmptyState message="No cycle transactions are available for the grouped comparison chart yet." />
            ) : (
                <SpendingComparison
                    comparisonChartData={comparisonChartData}
                    comparisonChartYTicks={comparisonChartYTicks}
                    comparisonChartScale={comparisonChartScale}
                    comparisonChartSeries={comparisonChartSeries}
                    spendingGranularity={spendingGranularity}
                />
            )}
        </section>
    )
}
