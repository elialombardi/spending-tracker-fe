import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import DashboardApp from './legacy/App';
import { createTheme, ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            paper: '#121217',
            default: 'transparent',
        },
    },
    shape: { borderRadius: 8 },
});

function DashboardRoot() {
    const hostRef = useRef(null);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return undefined;

        const mountNode = document.createElement('div');
        mountNode.className = 'dashboard-page';
        host.appendChild(mountNode);

        const root = createRoot(mountNode);

        root.render(
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles
                    styles={{
                        '.page-glow': { display: 'none' },
                        '.dashboard-page': { padding: '16px', background: 'transparent' },
                        '.shell': { maxWidth: '1180px', margin: '0 auto' },
                        '.panel': {
                            borderRadius: 12,
                            background: 'rgba(255,255,255,0.03)',
                            boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(255,255,255,0.04)',
                            padding: '16px',
                        },
                        '.dashboard-page .MuiPaper-root': {
                            background: 'rgba(255,255,255,0.03) !important',
                            color: 'inherit',
                        },
                        '.dashboard-page .panel, .dashboard-page .paper, .dashboard-page article': {
                            background: 'rgba(255,255,255,0.03) !important',
                        },
                        '.comparison-panel, .spending-comparison-panel': {
                            minHeight: '50vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                        },
                        '.comparison-pie-grid, .spending-comparison-layout': {
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'stretch',
                            height: '100%'
                        },
                        '.comparison-pie-card, .spending-series-card': {
                            flex: '1 1 0',
                            minWidth: 0,
                            padding: '12px',
                            background: 'rgba(255,255,255,0.02) !important'
                        },
                        '.comparison-pie-visual': {
                            borderRadius: 8,
                            height: '120px',
                            marginBottom: 8,
                        },
                        '.comparison-pie-legend .comparison-pie-swatch': {
                            width: 14,
                            height: 14,
                            borderRadius: 3,
                            display: 'inline-block',
                            marginRight: 8,
                        },
                        '.comparison-pie-legend-copy strong': { color: 'rgba(255,255,255,0.95)' },
                        '.comparison-pie-legend-copy span': { color: 'rgba(255,255,255,0.7)' },
                        '.button': {
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: 9999,
                            background: '#1976d2',
                            color: '#fff',
                            cursor: 'pointer',
                        },
                        '.button.button-ghost': {
                            background: 'transparent',
                            color: 'inherit',
                            border: '1px solid rgba(0,0,0,0.12)',
                        },
                        '.tab-button': {
                            background: 'transparent',
                            borderRadius: 8,
                            padding: '10px 14px',
                            display: 'inline-block',
                            marginRight: 8,
                        },
                        '.tab-button.is-active': {
                            background: 'rgba(25,118,210,0.12)',
                            boxShadow: 'inset 0 0 0 1px rgba(25,118,210,0.18)',
                        },
                        '.tab-count, .money-pill, .tag': {
                            background: 'rgba(255,255,255,0.04)',
                            color: 'rgba(255,255,255,0.9)',
                            padding: '4px 8px',
                            borderRadius: 9999,
                            display: 'inline-block',
                        },
                        '.upload-dropzone': {
                            border: '1px dashed rgba(255,255,255,0.06)',
                            borderRadius: 12,
                            padding: '18px',
                            background: 'transparent',
                        },
                        '.toast': {
                            position: 'fixed',
                            right: 16,
                            bottom: 16,
                            background: 'rgba(255,255,255,0.04)',
                            color: 'rgba(255,255,255,0.95)',
                            padding: '10px 14px',
                            borderRadius: 8,
                        },
                        'h1, h2, h3': { color: 'rgba(255,255,255,0.95)' },
                        '.hero-text, .section-note': { color: 'rgba(255,255,255,0.7)' },
                    }}
                />
                <DashboardApp />
            </ThemeProvider>,
        );

        return () => {
            root.unmount();
            host.removeChild(mountNode);
        };
    }, []);

    return <div ref={hostRef} />;
}

export default DashboardRoot;
