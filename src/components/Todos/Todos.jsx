import { useState, useEffect, useRef } from 'react';
import './Todos.css';
import Todo from './Todo/Todo.jsx';
import { useParams } from 'react-router-dom';
import { getRequest, createRequest } from '../../ServerRequests.jsx';
import { triggerError } from "../DisplayError/DisplayError.jsx";

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const newTodoRef = useRef();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const filtersRef = useRef({ search: '', id: '', title: '', completed: false, notCompleted: false });
  const [selectedOption, setSelectedOption] = useState("Id");

  const options = [
    "Id",
    "ABC",
    "Completed",
    "Randomaly"
  ];

  useEffect(() => {
    (async () => {
      try {
        const data = await getRequest('todos', 'userId', userId);
        setTodos(data.map(item => ({
          ...item,          // שומר את כל השדות הקיימים באובייקט
          isVisible: true    // הוספת השדה החדש
        })));
      } catch (error) {
        console.log(error);
      }
    })()
  }, [userId]);

  const handleAddTodo = () => {
    setShowModal(prev => !prev);
  };

  const handleSearch = () => {
    const { search, id, title, completed, notCompleted } = filtersRef.current;
    setTodos((prev) =>
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

  const handleSaveTodo = () => {
    const newTodoTitle = newTodoRef.current.value.trim();
    if (newTodoTitle) {
      const newTodo = {
        title: newTodoTitle,
        completed: false,
        userId: parseInt(userId, 10),
        isVisible: true,
      };
      (async () => {
        try {
          const data = await createRequest('todos', newTodo);
          setTodos([...todos, { ...data, isVisible: true }]);
          setShowModal(false);
        } catch (error) {
          console.log(error);
        }
      })()
    }
    else {
      triggerError("All fields must be filled out!")
    }

  };


  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    sortPage(selectedValue); // קריאה לפונקציית המיון
  };

  const sortPage = (sortBy) => {
    let sortedTodos;
    switch (sortBy) {
      case "Id":
        sortedTodos = [...todos].sort((a, b) => parseInt(a.id) - parseInt(b.id));  // מיון לפי ID
        break;
      case "ABC":
        sortedTodos = [...todos].sort((a, b) => a.title.localeCompare(b.title));  // מיון אלפביתי לפי כותרת
        break;
      case "Completed":
        sortedTodos = [...todos].sort((a, b) => b.completed - a.completed);  // מיון לפי מצב השלם (completed)
        break;
      case "Randomaly":
        sortedTodos = [...todos].sort(() => Math.random() - 0.5);  // מיון אקראי
        break;
      default:
        sortedTodos = todos;
        break;
    }
    setTodos(sortedTodos); // עדכון המערך הממויין
  }

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
        <div className="dropdown">
          <select
            value={selectedOption}
            onChange={handleChange}
            className="styled-select">
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

      </div>
      <div className="todos">
        {todos && todos.length > 0 &&
          todos.filter((todo) => todo.isVisible).length > 0 ? (
          todos.filter((todo) => todo.isVisible).map((todo) => (
            <div key={todo.id} className="todo">
              <Todo key={todo.id} id={todo.id} title={todo.title} completed={todo.completed} setTodos={setTodos} todos={todos} />
            </div>
          ))

        ) : (
          <h2>No tasks found.</h2>
        )}
      </div>
    </div>
  );
}

export default Todos;