import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

export const getAllRequest = async (resorce) => {
    const response = await fetch(`http://localhost:3000/${resorce}`);
    if (!(response.ok)) {
        throw new Error('Failed To Load Data');
    }
    return response.json();
}

export const getRequest = async (resorce, id, value) => {
    const response = await fetch(`http://localhost:3000/${resorce}/?${id}=${value}`);
    if (!(response.ok)) {
        throw new Error('Failed To Load Data');
    }
    return response.json();
}

export const createRequest = async (resorce, body) => {
    const response = await fetch(`http://localhost:3000/${resorce}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    if (!(response.ok)) {
        throw new Error('Failed To Post Data');
    }
    return response.json();

}

export const deleteRequest = async (resorce, id) => {
    const response = await fetch(`http://localhost:3000/${resorce}/${id}`, {
        method: 'DELETE',
    })
    if (!(response.ok)) {
        throw new Error('Failed To Delete Data');
    }
}

export const updateRequest = async (resorce, id, body) => {
    console.log(id);
    const response = await fetch(`http://localhost:3000/${resorce}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!(response.ok)) {
        throw new Error('Failed To Post Data');
    }
}