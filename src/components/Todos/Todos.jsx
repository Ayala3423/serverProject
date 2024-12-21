import { useState, useEffect, useRef } from 'react';
import './Todos.css';
import { useParams } from 'react-router-dom';

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newTodoRef = useRef();

  useEffect(() => {
    fetch(`http://localhost:3000/todos/?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setTodos(data));
  }, [userId]);

  const handleCheckbox = (id, currentValue) => {
    const updatedValue = !currentValue; // הערך ההפוך
    fetch(`http://localhost:3000/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({completed: updatedValue })
    }).then(() => {
      setTodos(todos.map((todo) =>
        todo.id === id ? { ...todo, completed: updatedValue  } : todo
      ));});
  };

  const handleAddTodo = () => {
    setShowModal(prev => !prev);
  };

  const handleSaveTodo = () => {
    const newTodoTitle = newTodoRef.current.value.trim();
    if (newTodoTitle) {
      const newTodo = {
        id: todos.length + 1, // לדוגמה, יצירת ID חדש
        title: newTodoTitle,
        completed: false,
        userId: parseInt(userId, 10),
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
    fetch(`http://localhost:3000/todos/?id=${idToDelete}`, {
      method: 'DELETE'
    }).then(() => {
      setTodos(prev=>prev.filter(item => item.id !== idToDelete)); // עדכון הרשימה בלקוח
    });
  }

  return (
    <>
      <h1>Todos</h1>
      <div>
        <button onClick={handleAddTodo}>Add</button>
        <button>Search</button>

      </div>

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

      <h1>todos</h1>
      <div className='todos'>
        {todos ? (todos.map((todo) => {
          return (
            <div key={todo.id} className='todo'>
              <h2>Id: {todo.id}</h2>
              <h2>Title: {todo.title}</h2>
              <label>
                <input
                  type='checkbox'
                  checked={todo.completed}
                  onChange={() => handleCheckbox(todo.id, todo.completed)}
                />
                Completed
              </label>
              <button onClick={()=>handleDelete(todo.id)}>Delete</button>
              <button onClick={handleDelete}>Edit</button>
            </div>
          );
        })) : <h2>loading...</h2>}
      </div>
    </>
  );
}

export default Todos;