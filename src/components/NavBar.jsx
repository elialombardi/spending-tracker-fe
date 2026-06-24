import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import { NavLink, useLocation } from 'react-router-dom'

function NavBar() {
    const loc = useLocation()
    const path = loc.pathname
    const subtitle = path === '/dashboard'
        ? 'Location Map • Merged dashboard workspace'
        : 'Location Map • Manage tags and locations'

    return (
        <AppBar position="static" color="transparent" elevation={0} sx={{ mb: 2 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Button component={NavLink} to="/" variant={path === '/' ? 'contained' : 'text'} sx={{ mr: 1 }} end>
                        Map
                    </Button>
                    <Button component={NavLink} to="/tags" variant={path === '/tags' ? 'contained' : 'text'}>
                        Tags
                    </Button>
                    <Button component={NavLink} to="/dashboard" variant={path === '/dashboard' ? 'contained' : 'text'} sx={{ ml: 1 }}>
                        Dashboard
                    </Button>
                </Box>
                <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;
