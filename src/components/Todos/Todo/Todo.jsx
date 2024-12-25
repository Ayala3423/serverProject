import { useState, useRef } from 'react';
import './Todo.css';

function Todo({ id, title, completed }) {
    const [idEditing, setIdEditing] = useState(null);
    const titleRef = useRef();
    const { todos, setTodos } = useState(null); 

    const handleDelete = (idToDelete) => {
        fetch(`http://localhost:3000/todos/${idToDelete}`, {
            method: 'DELETE',
        }).then(() => {
            setTodos((prev) => prev.filter((item) => item.id !== idToDelete));
        });
    };

    const handleEdit = (idToEdit) => {
        const updatedTitle = titleRef.current?.value.trim();
        if (!updatedTitle) {
            alert('Title cannot be empty');
            return;
        }

        fetch(`http://localhost:3000/todos/${idToEdit}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: updatedTitle }),
        }).then(() => {
            setTodos(
                todos.map((todo) =>
                    todo.id === idToEdit ? { ...todo, title: updatedTitle } : todo
                )
            );
            setIdEditing(null);
        });
    };

    const handleCheckbox = (id, currentValue) => {
        const updatedValue = !currentValue;
        fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: updatedValue }),
        }).then(() => {
            setTodos(
                todos.map((todo) =>
                    todo.id === id ? { ...todo, completed: updatedValue } : todo
                )
            );
        });
    };

    return (
        <div className="todo-item">
            <div className="todo-header">
                <span className="todo-id">Id: {id}</span>
                <div className="todo-buttons">
                    {idEditing === id ? (
                        <button onClick={() => handleEdit(id)}>Save</button>
                    ) : (
                        <button onClick={() => setIdEditing(id)}>Edit</button>
                    )}
                    <button onClick={() => handleDelete(id)}>Delete</button>
                </div>
            </div>
            <div className="todo-title">
                {idEditing === id ? (
                    <input ref={titleRef} type="text" defaultValue={title} />
                ) : (
                    <h2>{title}</h2>
                )}
            </div>
            <div className="todo-completed">
                <label>
                    <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => handleCheckbox(id, completed)}
                        readOnly
                    />
                    Completed
                </label>
            </div>
        </div>
    );
}

export default Todo;
