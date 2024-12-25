// import { useState, useEffect, useRef, use } from 'react'
// import './Search.css'
// import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";
// import { TodosContext } from '../Todos/Todos.jsx'; // ייבוא הקשר

// function Search() {
//     const [showFilterModal, setShowFilterModal] = useState(false); // חלונית מסננים
//     const searchRef = useRef(); // שדה החיפוש החופשי
//     const idFilterRef = useRef(); // מסנן מזהה
//     const titleFilterRef = useRef(); // מסנן כותרת
//     const completedFilterRef = useRef(false); // מסנן משימות שהושלמו
//     const notCompletedFilterRef = useRef(false); // מסנן משימות שלא הושלמו
//     const { todos, setComponent } = useContext(TodosContext); // שימוש ב-context

//     const handleSearch = () => {
//         const searchValue = searchRef.current?.value.trim().toLowerCase() || ''; // ערך חיפוש חופשי
//         const idFilterValue = idFilterRef.current?.value.trim() || ''; // ערך מזהה
//         const titleFilterValue = titleFilterRef.current?.value.trim().toLowerCase() || ''; // ערך כותרת
//         const completedFilterValue = completedFilterRef.current; // ערך סינון משימות שהושלמו
//         const notCompletedFilterValue = notCompletedFilterRef.current; // ערך סינון משימות שלא הושלמו

//         setComponent((prev) =>
//             prev.map((todo) => {
//                 const matchesSearch =
//                     searchValue === '' || todo.title.toLowerCase().includes(searchValue);
//                 const matchesId =
//                     idFilterValue === '' || todo.id.toString() === idFilterValue;
//                 const matchesTitle =
//                     titleFilterValue === '' ||
//                     todo.title.toLowerCase().includes(titleFilterValue);
//                 const matchesCompleted =
//                     (!completedFilterValue || todo.completed) &&
//                     (!notCompletedFilterValue || !todo.completed); // התנאי לשני המסננים

//                 return {
//                     ...todo, // שמירה על המאפיינים הקיימים של המשימה
//                     isVisible: matchesSearch && matchesId && matchesTitle && matchesCompleted,
//                 };
//             })
//         );
//     };

//     return (
//         <>
//             {/* שורת חיפוש חופשי */}
//             <div className="search-bar">
//                 <input
//                     type="text"
//                     ref={searchRef}
//                     placeholder="Search..."
//                     onChange={handleSearch} // חיפוש מיידי בעת הקלדה
//                 />
//                 <button onClick={() => setShowFilterModal(true)}>Filters</button>
//             </div>
//             {/* חלונית מסננים */}
//             {showFilterModal && (
//                 <div className="modal">
//                     <div className="modal-content">
//                         <h2>Advanced Filters</h2>
//                         <input
//                             type="text"
//                             ref={idFilterRef}
//                             placeholder="Filter by ID"
//                             onChange={handleSearch} // עדכון חיפוש
//                         />
//                         <input
//                             type="text"
//                             ref={titleFilterRef}
//                             placeholder="Filter by Title"
//                             onChange={handleSearch} // עדכון חיפוש
//                         />
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 onChange={(e) => {
//                                     completedFilterRef.current = e.target.checked;
//                                     handleSearch(); // עדכון חיפוש
//                                 }}
//                             />
//                             Show only completed tasks
//                         </label>
//                         <label>
//                             <input
//                                 type="checkbox"
//                                 onChange={(e) => {
//                                     notCompletedFilterRef.current = e.target.checked;
//                                     handleSearch(); // עדכון חיפוש
//                                 }}
//                             />
//                             Show only not completed tasks
//                         </label>
//                         <button onClick={() => setShowFilterModal(false)}>Close</button>
//                     </div>
//                 </div>
//             )}
//         </>
//     )
// }

// export default Search;
import { useState, useRef } from 'react';
import './Search.css';

function Search({setComponent}) {
    const [showFilterModal, setShowFilterModal] = useState(false);
    const filtersRef = useRef({ search: '', id: '', title: '', completed: false, notCompleted: false });

    const handleSearch = () => {
        const { search, id, title, completed, notCompleted } = filtersRef.current;
        setComponent((prev) =>
            prev.map((todo) => ({
                ...todo,
                isVisible:
                    (!search || todo.title.toLowerCase().includes(search)) &&
                    (!id || todo.id.toString() === id) &&
                    (!title || todo.title.toLowerCase().includes(title)) &&
                    (!completed || todo.completed) &&
                    (!notCompleted || !todo.completed),
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