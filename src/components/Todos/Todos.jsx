import { useState, useEffect, useRef } from 'react';
import './Todos.css';
import { useParams } from 'react-router-dom';

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);
  const [filteredTodos, setFilteredTodos] = useState(null); // משימות מסוננות
  const [showFilterModal, setShowFilterModal] = useState(false); // חלונית מסננים
  const searchRef = useRef(); // שדה החיפוש החופשי
  const idFilterRef = useRef(); // מסנן מזהה
  const titleFilterRef = useRef(); // מסנן כותרת
  const completedFilterRef = useRef(false); // מסנן משימות שהושלמו
  const notCompletedFilterRef = useRef(false); // מסנן משימות שלא הושלמו

  useEffect(() => {
    fetch(`http://localhost:3000/todos/?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTodos(data);
        setFilteredTodos(data); // כברירת מחדל כל המשימות מוצגות
      });
  }, [userId]);

  const handleSearch = () => {
    const searchValue = searchRef.current?.value.trim().toLowerCase() || ''; // ערך חיפוש חופשי
    const idFilterValue = idFilterRef.current?.value.trim() || ''; // ערך מזהה
    const titleFilterValue = titleFilterRef.current?.value.trim().toLowerCase() || ''; // ערך כותרת
    const completedFilterValue = completedFilterRef.current; // ערך סינון משימות שהושלמו
    const notCompletedFilterValue = notCompletedFilterRef.current; // ערך סינון משימות שלא הושלמו

    const filtered = todos.filter((todo) => {
      // בדיקות סינון
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

      return matchesSearch && matchesId && matchesTitle && matchesCompleted; // חפיפה בין התנאים
    });

    setFilteredTodos(filtered); // עדכון הרשימה המסוננת
  };

  return (
    <div>
      <h1>Todos</h1>

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

      {/* רשימת משימות */}
      <div className="todos">
        {filteredTodos && filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <div key={todo.id} className="todo">
              <h2>Id: {todo.id}</h2>
              <h2>Title: {todo.title}</h2>
              <label>
                <input type="checkbox" checked={todo.completed} readOnly />
                Completed
              </label>
            </div>
          ))
        ) : (
          <h2>No tasks found.</h2> // הודעה במקרה שאין תוצאות
        )}
      </div>
    </div>
  );
}

export default Todos;
