import { useState, useEffect } from 'react'
import './Todos.css'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

function Todos() {
  const { userId } = useParams();
  const [todos, setTodos] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/todos/?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => setTodos(data))

  }, [])

  const handleCheckbox = (id) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }

  return (
    <>
      <h1>Todos</h1>
      <div className='todos'>
        {todos ? (todos.map((todo) => {
          return (<div key={todo.id} className='todo'>
            <h2>Id: {todo.id}</h2>
            <h2>Title: {todo.title}</h2>
            <label><input type='checkbox' checked={todo.completed} onChange={() => handleCheckbox(todo.id)} />Completed</label>
          </div>);
        })) : <h2>loading...</h2>}
      </div>
    </>
  )
}

export default Todos
