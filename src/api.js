// API layer: endpoints, data schemas, and lightweight client helpers
// This file is intended to be handed to the backend developer so they
// know the routes, HTTP verbs, and expected request/response shapes.

// Prefer runtime `window.__ENV__` (set by the container), then Vite env var `VITE_API_BASE`,
// then legacy `REACT_APP_API_BASE`, then local default.
const runtimeEnv = (typeof window !== 'undefined' && window.__ENV__) || {};
const API_BASE = (runtimeEnv.VITE_API_BASE || runtimeEnv.REACT_APP_API_BASE)
    || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
    || (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_BASE)
    || 'https://localhost:7004';

const endpoints = {
    // Locations
    listLocations: { method: 'GET', path: '/locations' }, // returns Location[]
    getLocation: { method: 'GET', path: '/locations/:id' }, // returns Location
    createLocation: { method: 'POST', path: '/locations' }, // body: CreateLocation -> returns Location
    updateLocation: { method: 'PUT', path: '/locations/:id' }, // body: UpdateLocation -> returns Location
    deleteLocation: { method: 'DELETE', path: '/locations/:id' }, // returns { success: true }

    // Tags
    listTags: { method: 'GET', path: '/tags' }, // returns string[]
    createTag: { method: 'POST', path: '/tags' }, // body: { name } -> returns tag string
    renameTag: { method: 'PATCH', path: '/tags/:name' }, // body: { newName } -> returns { oldName, newName }
    deleteTag: { method: 'DELETE', path: '/tags/:name' }, // returns { success: true }

    // Location-specific tag toggle (alternate to updating whole location)
    toggleLocationTag: { method: 'POST', path: '/locations/:id/tags' }, // body: { tag, present: boolean } -> returns Location
};

// Data shape documentation (JS object examples and JSDoc-like typedefs)
const schemas = {
    Location: {
        // A single place/location saved by the app
        // id: number|string (server-generated)
        // title: string
        // tags: string[]
        // url: optional string
        // lat: number (decimal degrees)
        // lng: number (decimal degrees)
        // description: optional string
        example: {
            id: 1,
            title: 'Central Park',
            tags: ['kids'],
            url: 'https://example.com',
            lat: 40.7829,
            lng: -73.9654,
            description: 'Great for kids',
        },
    },

    CreateLocation: {
        // Fields required to create a Location. `id` is assigned by server.
        example: {
            title: 'Joe\'s Pizza',
            tags: ['restaurant'],
            url: 'https://www.joespizza.com',
            lat: 40.7308,
            lng: -73.9973,
            description: 'Classic NY slice',
        },
    },

    UpdateLocation: {
        // Full resource replacement expected by PUT; partial updates can be supported via PATCH if preferred.
        example: {
            title: 'Updated title',
            tags: ['restaurant', 'favorite'],
            url: 'https://example.com',
            lat: 40.7308,
            lng: -73.9973,
            description: 'Updated',
        },
    },

    Tag: {
        // tags are simple strings
        example: 'restaurant',
    },
};

// Lightweight fetch wrapper used by client helpers
async function fetchJSON(path, opts = {}) {
    const url = (API_BASE || '') + path;
    const headers = Object.assign({ 'Content-Type': 'application/json', Accept: 'application/json' }, opts.headers || {});
    const res = await fetch(url, { ...opts, headers });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        const err = new Error(`Request failed ${res.status} ${res.statusText}`);
        err.status = res.status;
        err.body = text;
        throw err;
    }
    // If no content
    if (res.status === 204) return null;
    return res.json().catch(() => null);
}

// Client helper functions
const api = {
    endpoints,
    schemas,
    API_BASE,

    // Locations
    listLocations: async () => fetchJSON(endpoints.listLocations.path),
    getLocation: async (id) => fetchJSON(endpoints.getLocation.path.replace(':id', encodeURIComponent(String(id)))),
    createLocation: async (location) => fetchJSON(endpoints.createLocation.path, { method: 'POST', body: JSON.stringify(location) }),
    updateLocation: async (id, location) => fetchJSON(endpoints.updateLocation.path.replace(':id', encodeURIComponent(String(id))), { method: 'PUT', body: JSON.stringify(location) }),
    deleteLocation: async (id) => fetchJSON(endpoints.deleteLocation.path.replace(':id', encodeURIComponent(String(id))), { method: 'DELETE' }),

    // Tags
    listTags: async () => fetchJSON(endpoints.listTags.path),
    createTag: async (name) => fetchJSON(endpoints.createTag.path, { method: 'POST', body: JSON.stringify({ name }) }),
    renameTag: async (oldName, newName) => fetchJSON(endpoints.renameTag.path.replace(':name', encodeURIComponent(String(oldName))), { method: 'PATCH', body: JSON.stringify({ newName }) }),
    deleteTag: async (name) => fetchJSON(endpoints.deleteTag.path.replace(':name', encodeURIComponent(String(name))), { method: 'DELETE' }),

    // Toggle a tag on a location (server may also accept full location updates)
    toggleLocationTag: async (id, tag, present) => fetchJSON(endpoints.toggleLocationTag.path.replace(':id', encodeURIComponent(String(id))), { method: 'POST', body: JSON.stringify({ tag, present }) }),
};

export default api;

// Also export named pieces for convenience
export { API_BASE, endpoints, schemas, fetchJSON };
