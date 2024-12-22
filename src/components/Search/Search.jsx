import { useState, useEffect, useRef, useContext } from 'react'
import './Search.css'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
import { TodosContext } from '../Todos/Todos.jsx'; // ייבוא הקשר

function Search() {
    const [showFilterModal, setShowFilterModal] = useState(false); // חלונית מסננים
    const searchRef = useRef(); // שדה החיפוש החופשי
    const idFilterRef = useRef(); // מסנן מזהה
    const titleFilterRef = useRef(); // מסנן כותרת
    const completedFilterRef = useRef(false); // מסנן משימות שהושלמו
    const notCompletedFilterRef = useRef(false); // מסנן משימות שלא הושלמו
    const { todos, setTodos } = useContext(TodosContext); // שימוש ב-context

    const handleSearch = () => {
        const searchValue = searchRef.current?.value.trim().toLowerCase() || ''; // ערך חיפוש חופשי
        const idFilterValue = idFilterRef.current?.value.trim() || ''; // ערך מזהה
        const titleFilterValue = titleFilterRef.current?.value.trim().toLowerCase() || ''; // ערך כותרת
        const completedFilterValue = completedFilterRef.current; // ערך סינון משימות שהושלמו
        const notCompletedFilterValue = notCompletedFilterRef.current; // ערך סינון משימות שלא הושלמו

        setTodos((prev) =>
            prev.map((todo) => {
                const matchesSearch =
                    searchValue === '' || todo.title.toLowerCase().includes(searchValue);
                const matchesId =
                    idFilterValue === '' || todo.id.toString() === idFilterValue;
                const matchesTitle =
                    titleFilterValue === '' ||
                    todo.title.toLowerCase().includes(titleFilterValue);
                const matchesCompleted =
                    (!completedFilterValue || todo.completed) &&
                    (!notCompletedFilterValue || !todo.completed); // התנאי לשני המסננים

                return {
                    ...todo, // שמירה על המאפיינים הקיימים של המשימה
                    isVisible: matchesSearch && matchesId && matchesTitle && matchesCompleted,
                };
            })
        );
    };

    return (
        <>
            {/* שורת חיפוש חופשי */}
            <div className="search-bar">
                <input
                    type="text"
                    ref={searchRef}
                    placeholder="Search..."
                    onChange={handleSearch} // חיפוש מיידי בעת הקלדה
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
                            ref={idFilterRef}
                            placeholder="Filter by ID"
                            onChange={handleSearch} // עדכון חיפוש
                        />
                        <input
                            type="text"
                            ref={titleFilterRef}
                            placeholder="Filter by Title"
                            onChange={handleSearch} // עדכון חיפוש
                        />
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    completedFilterRef.current = e.target.checked;
                                    handleSearch(); // עדכון חיפוש
                                }}
                            />
                            Show only completed tasks
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                onChange={(e) => {
                                    notCompletedFilterRef.current = e.target.checked;
                                    handleSearch(); // עדכון חיפוש
                                }}
                            />
                            Show only not completed tasks
                        </label>
                        <button onClick={() => setShowFilterModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default Search;