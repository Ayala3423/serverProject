import { useState, useRef } from 'react';
import './Search.css';

function Search({setComponent}) {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const filtersRef = useRef({ search: '', id: '', title: '', completed: false, notCompleted: false });

    const handleSearch = () => {
        const { search, id, title, completed, notCompleted } = filtersRef.current;
        setComponent((prev) =>
            prev.map((component) => ({
                ...component,
                isVisible:
                    (!search || component.title.toLowerCase().includes(search)) &&
                    (!id || component.id.toString() === id) &&
                    (!title || component.title.toLowerCase().includes(title)) &&
                    (!completed || component.completed) &&
                    (!notCompleted || !component.completed),
            }))
        );
    };

    const updateFilter = (key, value) => {
        filtersRef.current[key] = value;
        handleSearch();
    };

    return (
        <>
            {/* שורת חיפוש חופשי */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    onChange={(e) => updateFilter('search', e.target.value.toLowerCase())}
                />
                <button onClick={() => setShowFilterModal(true)}>Filters</button>
            </div>

            {/* חלונית מסננים */}
            {showFilterModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Advanced Filters</h2>
                        <input
                            type="text"
                            placeholder="Filter by ID"
                            onChange={(e) => updateFilter('id', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Filter by Title"
                            onChange={(e) => updateFilter('title', e.target.value.toLowerCase())}
                        />
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => updateFilter('completed', e.target.checked)}
                            />
                            Show only completed tasks
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => updateFilter('notCompleted', e.target.checked)}
                            />
                            Show only not completed tasks
                        </label>
                        <button onClick={() => setShowFilterModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Search;