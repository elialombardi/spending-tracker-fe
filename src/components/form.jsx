function LocationForm({ value, onChange, onSubmit }) {
    const handleFieldChange = (field) => (event) => {
        onChange({ ...value, [field]: event.target.value });
    };

    return (
        <form
            onSubmit={onSubmit}
            style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
        >
            <input
                placeholder="Name"
                value={value.name}
                onChange={handleFieldChange('name')}
                required
            />
            <select value={value.type} onChange={handleFieldChange('type')}>
                <option value="restaurant">Restaurant</option>
                <option value="kids">Kids</option>
            </select>
            <input
                placeholder="Latitude"
                type="number"
                step="any"
                value={value.lat}
                onChange={handleFieldChange('lat')}
                required
            />
            <input
                placeholder="Longitude"
                type="number"
                step="any"
                value={value.lng}
                onChange={handleFieldChange('lng')}
                required
            />
            <input
                placeholder="Description"
                value={value.description}
                onChange={handleFieldChange('description')}
            />
            <button type="submit">Add Location</button>
        </form>
    );
}

export default LocationForm;