import { useState, useRef } from 'react';
import './Todo.css';
import { deleteRequest, updateRequest } from '../../../ServerRequests'

function Todo({ id, title, completed, setTodos, todos }) {
    const [idEditing, setIdEditing] = useState(null);
    const titleRef = useRef();

    const handleDelete = () => {
        (async () => {
            try {
                await deleteRequest('todos', id);
                setTodos((prev) => prev.filter((item) => item.id !== id));
            } catch (error) {
                console.log(error);
            }
        })()
    };

    const handleEdit = () => {
        const updatedTitle = titleRef.current?.value.trim();
        if (!updatedTitle) {
            alert('Title cannot be empty');
            return;
        }
        (async () => {
            try {
                await updateRequest('todos', id, { title: updatedTitle });
                setTodos(
                    todos.map((todo) =>
                        todo.id === id ? { ...todo, title: updatedTitle } : todo
                    )
                );
                setIdEditing(null);
            } catch (error) {
                console.log(error);
            }
        })()
    };

    const handleCheckbox = (currentValue) => {
        (async () => {
            try {
                await updateRequest('todos', id, { completed: !currentValue });
                setTodos(
                    todos.map((todo) =>
                        todo.id === id ? { ...todo, completed: !currentValue } : todo
                    )
                );
            } catch (error) {
                console.log(error);
            }
        })()
    };

    return (
        <div className="todo-item">
            <div className="todo-header">
                <span className="todo-id">Id: {id}</span>
                <div className="todo-buttons">
                    {idEditing === id ? (
                        <button onClick={handleEdit}>Save</button>
                    ) : (
                        <button onClick={() => setIdEditing(id)}>Edit</button>
                    )}
                    <button onClick={handleDelete}>Delete</button>
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
                        onChange={() => handleCheckbox(completed)}
                        readOnly
                    />
                    Completed
                </label>
            </div>
        </div>
    );
}

export default Todo;
