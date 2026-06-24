import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'
import { formatCycleOptionLabel, formatMoney, formatReportRange } from '../lib/formatters'

export default function AppHeader({
    cycleOptions,
    hasNextCycle,
    hasPreviousCycle,
    isBusy,
    monthlyReport,
    onCycleStartChange,
    onExport,
    onNextCycle,
    onPreviousCycle,
    onRefresh,
    selectedCycleStart,
}) {
    return (
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Paper sx={{ flex: '1 1 60%', p: 3 }} elevation={1}>
                <Typography variant="overline" sx={{ display: 'block', mb: 1 }}>
                    Poste Italiane spending desk
                </Typography>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
                    See where the pay cycle is leaking money.
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Upload the latest workbook, review uncertain merchants, teach the tracker new categories,
                    and export a clean spending-cycle report in one place.
                </Typography>
            </Paper>

            <Paper sx={{ flex: '1 1 34%', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }} elevation={1}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Button variant="outlined" onClick={onPreviousCycle} disabled={isBusy || !hasPreviousCycle}>
                        Previous
                    </Button>

                    <FormControl size="small" sx={{ minWidth: 180 }}>
                        <InputLabel id="cycle-start-label">Cycle starts on</InputLabel>
                        <Select
                            labelId="cycle-start-label"
                            value={selectedCycleStart}
                            label="Cycle starts on"
                            onChange={(e) => onCycleStartChange(e.target.value)}
                            disabled={isBusy || cycleOptions.length === 0}
                        >
                            {cycleOptions.length === 0 ? (
                                <MenuItem value="">No cycles available</MenuItem>
                            ) : (
                                cycleOptions.map((cycleOption) => (
                                    <MenuItem key={cycleOption.from} value={cycleOption.from}>
                                        {formatCycleOptionLabel(cycleOption)}
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>

                    <Button variant="outlined" onClick={onNextCycle} disabled={isBusy || !hasNextCycle}>
                        Next
                    </Button>
                </Box>

                {monthlyReport ? (
                    <Typography variant="body2" color="text.secondary">
                        {formatReportRange(monthlyReport)}. {monthlyReport.categories.length} categories,{' '}
                        {formatMoney(monthlyReport.uncategorizedSpent)} still uncategorized.
                    </Typography>
                ) : null}

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" onClick={onRefresh} disabled={isBusy}>
                        Refresh
                    </Button>
                    <Button variant="contained" color="primary" onClick={() => onExport('csv')} disabled={isBusy}>
                        Export CSV
                    </Button>
                    <Button variant="outlined" onClick={() => onExport('xlsx')} disabled={isBusy}>
                        Export Excel
                    </Button>
                </Box>
            </Paper>
        </Box>
    )
}