import { useState, useRef, useContext } from 'react';
import './Todo.css';
import { TodosContext } from '../Todos.jsx'; // ייבוא הקשר

function Todo({ id, title, completed }) {
    const [idEditing, setIdEditing] = useState(null);
    const titleRef = useRef();
    const { todos, setTodos } = useContext(TodosContext); // שימוש ב-context

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
        <>
            <h2>Id: {id}</h2>
            {idEditing === id ? (
                <input ref={titleRef} type="text" defaultValue={title} />
            ) : (
                <h2>Title: {title}</h2>
            )}
            <label>
                <input
                    type="checkbox"
                    checked={completed}
                    onChange={() => handleCheckbox(id, completed)}
                    readOnly
                />
                Completed
            </label>

            {idEditing === id ? (
                <button onClick={() => handleEdit(id)}>Save</button>
            ) : (
                <button onClick={() => setIdEditing(id)}>Edit</button>
            )}
            <button onClick={() => handleDelete(id)}>Delete</button>
        </>
    );
}

export default Todo;
