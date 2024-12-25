import { useState, useEffect, useRef } from 'react';
import './Todos.css';
import Todo from './Todo/Todo.jsx';
import { useParams } from 'react-router-dom';
import Search from '../Search/Search.jsx';

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newTodoRef = useRef();

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

  const handleAddTodo = () => {
    setShowModal(prev => !prev);
  };

  const handleSaveTodo = () => {
    const newTodoTitle = newTodoRef.current.value.trim();
    const newId=todos.length?JSON.stringify(JSON.parse(todos[todos.length - 1].id) + 1):"1";
    if (newTodoTitle) {
      const newTodo = {
        id: newId, 
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
        setTodos([...todos, { ...newTodo, isVisible: true }]);
        setShowModal(false); 
      });
    }
  };

  return (
      <div>
        <h1>Todos</h1>
        <div className="button-group">
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
          <Search setComponent={setTodos} />
        </div>
        <div className="todos">
          {todos && todos.length > 0 ? (
            todos.filter((todo) => todo.isVisible).length > 0 ? (
              todos.filter((todo) => todo.isVisible).map((todo) => (
                <div key={todo.id} className="todo">
                  <Todo id={todo.id} title={todo.title} completed={todo.completed} setTodos={setTodos} todos={todos} />
                </div>
              ))
            ) : (
              <h2>No tasks found.</h2>
            )
          ) : (
            <h2>Loading tasks...</h2>
          )}
        </div>
      </div>
  );
}

export default Todos;
