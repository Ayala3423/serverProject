import { useState, useEffect, useRef } from 'react';
import './Todos.css';
import { useParams } from 'react-router-dom';

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);
  const [idEditing, setIdEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newTodoRef = useRef();
  const [showFilterModal, setShowFilterModal] = useState(false); // חלונית מסננים
  const searchRef = useRef(); // שדה החיפוש החופשי
  const idFilterRef = useRef(); // מסנן מזהה
  const titleFilterRef = useRef(); // מסנן כותרת
  const titleRef = useRef();
  const completedFilterRef = useRef(false); // מסנן משימות שהושלמו
  const notCompletedFilterRef = useRef(false); // מסנן משימות שלא הושלמו

  useEffect(() => {
    fetch(`http://localhost:3000/todos/?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((todo) => ({
          ...todo, // העתקת כל השדות הקיימים
          isVisible: true, // שדה נוסף חדש
        }));
        setTodos(updatedData);
      });
  }, [userId]);

  const handleCheckbox = (id, currentValue) => {
    const updatedValue = !currentValue; // הערך ההפוך
    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: updatedValue })
    }).then(() => {
      setTodos(todos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedValue } : todo
      ));
    });
  };

  const handleAddTodo = () => {
    setShowModal(prev => !prev);
  };

  const handleSaveTodo = () => {
    const newTodoTitle = newTodoRef.current.value.trim();
    if (newTodoTitle) {
      const newTodo = {
        id: JSON.stringify(JSON.parse(todos[todos.length - 1].id) + 1), // לדוגמה, יצירת ID חדש
        title: newTodoTitle,
        completed: false,
        userId: parseInt(userId, 10),
        isVisible: true
      };

      // שמירה לשרת
      fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      }).then(() => {
        setTodos([...todos, newTodo]); // עדכון הרשימה בלקוח
        setShowModal(false); // סגירת ה-Modal
      });
    }
  };

  const handleDelete = (idToDelete) => {
    fetch(`http://localhost:3000/todos/${idToDelete}`, {
      method: 'DELETE'
    }).then(() => {
      setTodos(prev => prev.filter(item => item.id != idToDelete)); // עדכון הרשימה בלקוח
    });
  }

  const handleEdit = (idToEdit) => {
    const updatedTitle = titleRef.current?.value.trim(); // קבלת הערך המעודכן
    if (!updatedTitle) {
      alert("Title cannot be empty");
      return;
    }

    fetch(`http://localhost:3000/todos/${idToEdit}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: updatedTitle }),
    }).then(() => {
      setTodos(todos.map((todo) =>
        todo.id === idToEdit ? { ...todo, title: updatedTitle } : todo
      ));
      setIdEditing(null); // סיום מצב העריכה
    });
  };


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
    <div>
      <h1>Todos</h1>
      <div>
        <button onClick={handleAddTodo}>Add</button>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add New Todo</h2>
              <input
                type="text"
                ref={newTodoRef}
                placeholder="Enter task title"
              />
              <button onClick={handleSaveTodo}>Save</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        )}
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

      <div className='todos'>
        {todos && todos.length > 0 ? (
          todos.filter(todo => todo.isVisible).length > 0 ? (
            todos.filter(todo => todo.isVisible).map((todo) => (
              <div key={todo.id} className='todo'>
                <h2>Id: {todo.id}</h2>
                {idEditing === todo.id ? (
                  <input
                    ref={titleRef}
                    type="text"
                    defaultValue={todo.title}
                  />
                ) : (
                  <h2>Title: {todo.title}</h2>
                )}
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleCheckbox(todo.id, todo.completed)}
                    readOnly />
                  Completed
                </label>
                {idEditing === todo.id ? <button onClick={() => handleEdit(todo.id)}>Save</button> : <button onClick={() => setIdEditing(todo.id)}>Edit</button>}
                <button onClick={() => handleDelete(todo.id)}>Delete</button>
              </div>
            ))
          ) : (
            <h2>No tasks found.</h2> // הודעה אם אין תוצאות מסוננות
          )
        ) : (
          <h2>Loading tasks...</h2> // הודעה במקרה של טעינת משימות
        )}
      </div>

    </div>
  );
}

export default Todos;