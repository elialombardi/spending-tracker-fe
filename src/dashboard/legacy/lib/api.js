import { API_BASE } from '../../../api'

export async function fetchJson(url, options) {
    const fullUrl = (typeof url === 'string' && (url.startsWith('http://') || url.startsWith('https://')))
        ? url
        : (API_BASE || '') + url

    const response = await fetch(fullUrl, options)

    if (!response.ok) {
        throw new Error(await readError(response))
    }

    if (response.status === 204) {
        return null
    }

    return response.json()
}

export async function readError(response) {
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
        const payload = await response.json()
        return payload.title || payload.detail || JSON.stringify(payload)
    }

    return (await response.text()) || `${response.status} ${response.statusText}`
}

export { API_BASE }