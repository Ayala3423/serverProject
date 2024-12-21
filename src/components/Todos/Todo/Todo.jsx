import { useState, useEffect, useRef } from 'react'
import './Todo.css'
import { BrowserRouter as Router, Route, Routes, useParams } from "react-router-dom";

function Todo({id, title, completed, handleCheckbox}) {
    return (
        <>
            <div key={id} className='todo'>
                <h2>Id: {id}</h2>
                <h2>Title: {title}</h2>
                <label><input type='checkbox' checked={completed} onChange={() => handleCheckbox(id)} />Completed</label>
                <button>Delete</button>
                <button>Edit</button>
            </div>
        </>
    )
}

export default Todo;