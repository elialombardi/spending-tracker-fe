const runtimeEnv = (typeof window !== 'undefined' && window.__ENV__) || {}
const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) || {}
const processEnv = (typeof globalThis !== 'undefined' && globalThis.process && globalThis.process.env) || {}

const mode = runtimeEnv.MODE || viteEnv.MODE || processEnv.NODE_ENV || ''

export const API_BASE = (runtimeEnv.VITE_API_BASE || runtimeEnv.REACT_APP_API_BASE)
    || viteEnv.VITE_API_BASE
    || processEnv.REACT_APP_API_BASE
    || 'https://localhost:7004'

export const DEV_AUTH_USERNAME = runtimeEnv.VITE_AUTH_USERNAME
    || viteEnv.VITE_AUTH_USERNAME
    || processEnv.REACT_APP_AUTH_USERNAME
    || 'admin'

export const DEV_AUTH_PASSWORD = runtimeEnv.VITE_AUTH_PASSWORD
    || viteEnv.VITE_AUTH_PASSWORD
    || processEnv.REACT_APP_AUTH_PASSWORD
    || 'dev-password-change-me'

export const isDevelopmentEnv = Boolean(
    runtimeEnv.DEV ?? viteEnv.DEV ?? mode !== 'production',
)
