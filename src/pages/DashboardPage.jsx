import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import DashboardRoot from '../dashboard/DashboardRoot';

function DashboardPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DashboardRoot />
        </Box>
    );
}

export default DashboardPage;