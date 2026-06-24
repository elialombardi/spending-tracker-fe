import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DashboardRoot from '../dashboard/DashboardRoot';

function DashboardPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Spending Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Finance workflows are mounted inside the new app shell, while keeping the current app routing and theme.
                </Typography>
            </Paper>

            <DashboardRoot />
        </Box>
    );
}

export default DashboardPage;