const filters = [
    { value: 'all', label: 'All' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'kids', label: 'Kids' },
];

function FilterButtons({ filter, onFilterChange }) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            {filters.map((option) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onFilterChange(option.value)}
                    aria-pressed={filter === option.value}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
}

export default FilterButtons;