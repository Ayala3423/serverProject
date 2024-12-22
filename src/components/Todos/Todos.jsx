import { useState, useEffect, createContext } from 'react';
import './Todos.css';
import Todo from './Todo/Todo.jsx';
import { useParams } from 'react-router-dom';
import Search from '../Search/Search.jsx';
import Add from '../Add/Add.jsx';

// יצירת TodosContext
export const TodosContext = createContext(null);

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);

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

  return (
    <TodosContext.Provider value={{ todos, setTodos }}>
      <div>
        <h1>Todos</h1>
        <Add />
        <Search />
        <div className="todos">
          {todos && todos.length > 0 ? (
            todos.filter((todo) => todo.isVisible).length > 0 ? (
              todos.filter((todo) => todo.isVisible).map((todo) => (
                <div key={todo.id} className="todo">
                  <Todo id={todo.id} title={todo.title} completed={todo.completed} />
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
    </TodosContext.Provider>
  );
}

export default Todos;
