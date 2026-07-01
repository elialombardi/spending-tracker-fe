import { lazy, Suspense, useEffect, useState } from 'react';
import NavBar from './components/NavBar';
import api from './api';
import { Routes, Route, useLocation } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MapPage = lazy(() => import('./pages/MapPage'));
const TagsPage = lazy(() => import('./pages/TagsPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const defaultLocations = [
  {
    id: 1,
    title: 'Central Park',
    tags: ['kids'],
    url: 'https://www.nycgovparks.org/parks/central-park',
    lat: 40.7829,
    lng: -73.9654,
    description: 'Great for kids',
  },
  {
    id: 2,
    title: 'Joe’s Pizza',
    tags: ['restaurant'],
    url: 'https://www.joespizza.com',
    lat: 40.7308,
    lng: -73.9973,
    description: 'Classic NY slice',
  },
];

const emptyLocation = {
  title: '',
  tags: [],
  lat: '',
  lng: '',
  description: '',
  url: '',
};

const defaultTags = ['restaurant', 'kids'];

const defaultCenter = [41.9028, 12.4964];

function App() {
  const location = useLocation();
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });

  const [tags, setTags] = useState(() => {
    const saved = localStorage.getItem('tags');
    return saved ? JSON.parse(saved) : defaultTags;
  });

  const [filter, setFilter] = useState('all');
  // routing will handle views

  const [newLocation, setNewLocation] = useState(emptyLocation);
  const [center, setCenter] = useState(defaultCenter);

  useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(locations));
  }, [locations]);

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags));
  }, [tags]);

  // Load from API if available, otherwise keep localStorage/defaults
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [remoteLocations, remoteTags] = await Promise.all([api.listLocations(), api.listTags()]);
        if (!mounted) return;
        if (Array.isArray(remoteLocations)) setLocations(remoteLocations);
        if (Array.isArray(remoteTags)) setTags(remoteTags);
      } catch (err) {
        // fail silently and keep local state
        console.info('API not available or failed to load initial data, using local state', err && err.message);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleAddLocation = (e) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    (async () => {
      const payload = { ...newLocation, lat: parseFloat(newLocation.lat), lng: parseFloat(newLocation.lng) };
      try {
        const created = await api.createLocation(payload);
        // server returns created resource with id
        setLocations((current) => [...current, created || payload]);
      } catch (err) {
        // fallback to client-side id
        const id = Date.now();
        setLocations((currentLocations) => [
          ...currentLocations,
          { ...payload, id },
        ]);
      } finally {
        setNewLocation(emptyLocation);
      }
    })();
  };

  const handleMapClick = (latlng) => {
    const { lat, lng } = latlng;
    setNewLocation((cur) => ({ ...cur, lat: lat.toFixed(6), lng: lng.toFixed(6) }));
    setCenter([lat, lng]);
  };

  const handleSelectPlace = ({ title, lat, lng }) => {
    setNewLocation((cur) => ({ ...cur, title: title || cur.title, lat, lng }));
    setCenter([lat, lng]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported in this browser or context');

    // Try to get permission info when available to provide clearer messages
    try {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((res) => {
          if (res.state === 'denied') return alert('Location access is denied. Please enable location permissions for this site.');
        }).catch(() => { });
      }
    } catch { }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // keep same format as map click (strings with fixed decimals)
        const latStr = typeof lat === 'number' ? lat.toFixed(6) : String(lat);
        const lngStr = typeof lng === 'number' ? lng.toFixed(6) : String(lng);
        setNewLocation((cur) => ({ ...cur, lat: latStr, lng: lngStr }));
        setCenter([parseFloat(latStr), parseFloat(lngStr)]);
      },
      (err) => {
        console.warn('geolocation error', err);
        if (err && err.code === 1) return alert('Permission denied. Please allow location access.');
        if (err && err.code === 3) return alert('Location request timed out. Try again.');
        return alert('Unable to retrieve your location');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const filteredLocations = locations.filter((loc) => {
    if (filter === 'all') return true;
    return (loc.tags || []).includes(filter);
  });

  const pageTitle = location.pathname === '/dashboard' ? 'Spending Dashboard' : 'My Location Map';
  const routeFallback = <Box sx={{ p: 3 }}>Loading…</Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <NavBar />
      <Box>
        <Suspense fallback={routeFallback}>
          <Routes>
            <Route path="/" element={
              <MapPage
                filteredLocations={filteredLocations}
                tags={tags}
                filter={filter}
                setFilter={setFilter}
                newLocation={newLocation}
                setNewLocation={setNewLocation}
                handleAddLocation={handleAddLocation}
                handleMapClick={handleMapClick}
                handleSelectPlace={handleSelectPlace}
                handleUseCurrentLocation={handleUseCurrentLocation}
                center={center}
              />
            } />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tags" element={
              <TagsPage
                tags={tags}
                locations={locations}
                onRenameTag={async (oldTag, newTag) => {
                  try {
                    await api.renameTag(oldTag, newTag);
                  } catch (err) { console.info('renameTag API failed; falling back to client update'); }
                  setTags((t) => t.map((x) => (x === oldTag ? newTag : x)));
                  setLocations((locs) => locs.map((L) => ({ ...L, tags: (L.tags || []).map((tg) => (tg === oldTag ? newTag : tg)) })));
                }}
                onDeleteTag={async (tagToDelete) => {
                  try {
                    await api.deleteTag(tagToDelete);
                  } catch (err) { console.info('deleteTag API failed; falling back to client update'); }
                  setTags((t) => t.filter((x) => x !== tagToDelete));
                  setLocations((locs) => locs.map((L) => ({ ...L, tags: (L.tags || []).filter((tg) => tg !== tagToDelete) })));
                }}
                onCreateTag={async (newTag) => {
                  try {
                    await api.createTag(newTag);
                  } catch (err) { console.info('createTag API failed; falling back to client update'); }
                  setTags((t) => (t.includes(newTag) ? t : [...t, newTag]));
                }}
                onToggleLocationTag={async (locId, tag, present) => {
                  try {
                    const updated = await api.toggleLocationTag(locId, tag, present);
                    if (updated && updated.id) {
                      setLocations((locs) => locs.map((L) => (L.id === updated.id ? updated : L)));
                      return;
                    }
                  } catch (err) { console.info('toggleLocationTag API failed; falling back to client update'); }
                  setLocations((locs) => locs.map((L) => {
                    if (L.id !== locId) return L;
                    if (present) {
                      return L.tags && L.tags.includes(tag) ? L : { ...L, tags: [...(L.tags || []), tag] };
                    }
                    return { ...L, tags: (L.tags || []).filter((tg) => tg !== tag) };
                  }));
                }}
                onUpdateLocation={async (locId, updated) => {
                  try {
                    const remote = await api.updateLocation(locId, updated);
                    if (remote && remote.id) {
                      setLocations((locs) => locs.map((L) => (L.id === locId ? remote : L)));
                      return;
                    }
                  } catch (err) { console.info('updateLocation API failed; falling back to client update'); }
                  setLocations((locs) => locs.map((L) => (L.id === locId ? updated : L)));
                }}
              />
            } />
          </Routes>
        </Suspense>
      </Box>
    </Container>
  );
}

export default App;