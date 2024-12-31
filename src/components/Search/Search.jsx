import { useState, useRef } from 'react';
import './Search.css';

function Search({ setComponent }) {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const filtersRef = useRef({ search: '', id: '', title: '', completed: false, notCompleted: false });

    const handleSearch = () => {
        const { search, id, title, completed, notCompleted } = filtersRef.current;
        setComponent((prev) =>
            prev.map((comp) => ({
                ...comp,
                isVisible:
                    (!search || comp.title.toLowerCase().includes(search)) &&
                    (!id || comp.id.toString() === id) &&
                    (!title || comp.title.toLowerCase().includes(title)) &&
                    (!completed || comp.completed) &&
                    (!notCompleted || !comp.completed),
            }))
        );
    };
    

    const updateFilter = (key, value) => {
        filtersRef.current[key] = value;
        handleSearch();
    };

    return (
        <div>
            <div className="search-bar">
                <input type="text" placeholder="Search..." onChange={(e) => updateFilter('search', e.target.value.toLowerCase())} />
                <button onClick={() => setShowFilterModal(true)}>Filters</button>
            </div>
            {showFilterModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Advanced Filters</h2>
                        <input type="text" placeholder="Filter by ID" onChange={(e) => updateFilter('id', e.target.value)} />
                        <input type="text" placeholder="Filter by Title" onChange={(e) => updateFilter('title', e.target.value.toLowerCase())} />
                        <label><input type="checkbox" onChange={(e) => updateFilter('completed', e.target.checked)} /> Show only completed tasks</label>
                        <label><input type="checkbox" onChange={(e) => updateFilter('notCompleted', e.target.checked)} /> Show only not completed tasks</label>
                        <button onClick={() => setShowFilterModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Search;
