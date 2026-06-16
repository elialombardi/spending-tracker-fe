import { useEffect, useState } from 'react';
import FilterButtons from './components/FilterButtons';
import LocationForm from './components/form';
import LocationMap from './components/LocationMap';

const defaultLocations = [
  {
    id: 1,
    name: 'Central Park',
    type: 'kids',
    lat: 40.7829,
    lng: -73.9654,
    description: 'Great for kids',
  },
  {
    id: 2,
    name: 'Joe’s Pizza',
    type: 'restaurant',
    lat: 40.7308,
    lng: -73.9973,
    description: 'Classic NY slice',
  },
];

const emptyLocation = {
  name: '',
  type: 'restaurant',
  lat: '',
  lng: '',
  description: '',
};

function App() {
  const [locations, setLocations] = useState(() => {
    const saved = localStorage.getItem('locations');
    return saved ? JSON.parse(saved) : defaultLocations;
  });

  const [filter, setFilter] = useState('all');

  const [newLocation, setNewLocation] = useState(emptyLocation);

  useEffect(() => {
    localStorage.setItem('locations', JSON.stringify(locations));
  }, [locations]);

  const handleAddLocation = (e) => {
    e.preventDefault();
    const id = Date.now();
    setLocations((currentLocations) => [
      ...currentLocations,
      { ...newLocation, id, lat: parseFloat(newLocation.lat), lng: parseFloat(newLocation.lng) },
    ]);
    setNewLocation(emptyLocation);
  };

  const filteredLocations = locations.filter(
    (loc) => filter === 'all' || loc.type === filter
  );

  return (
    <div style={{ padding: '1rem' }}>
      <h1>📍 My Location Map</h1>

      <FilterButtons filter={filter} onFilterChange={setFilter} />
      <LocationMap locations={filteredLocations} />
      <LocationForm value={newLocation} onChange={setNewLocation} onSubmit={handleAddLocation} />
    </div>
  );
}

export default App;