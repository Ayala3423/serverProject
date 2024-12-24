import { useState, useEffect, useRef } from 'react'
import './Add.css'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

function Add() {
    const [showModal, setShowModal] = useState(false);
    const newTodoRef = useRef();

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
    return (
        <>
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
        </>
    )
}

export default Add;