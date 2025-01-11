import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'
const baseUrl = 'http://localhost:3000';

export const getAllRequest = async (resource) => {
    const response = await fetch(`${baseUrl}/${resource}`);
    if (!(response.ok)) {
        throw new Error('Failed To Load Data');
    }
    return response.json();
}

export const getRequest = async (resource, id, value) => {
    const response = await fetch(`${baseUrl}/${resource}/?${id}=${value}`);
    if (!(response.ok)) {
        throw new Error('Failed To Load Data');
    }
    return response.json();
}

export const createRequest = async (resource, body) => {
    const response = await fetch(`${baseUrl}/${resource}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    if (!(response.ok)) {
        throw new Error('Failed To Post Data');
    }
    return response.json();
}

export const deleteRequest = async (resource, id) => {
    const response = await fetch(`${baseUrl}/${resource}/${id}`, {
        method: 'DELETE',
    })
    if (!(response.ok)) {
        throw new Error('Failed To Delete Data');
    }
}

export const deleteAllRequest = async (resource, array) => {
    alert(array)
    const deletePromises = array.map((obj) =>
        fetch(`${baseUrl}/${resource}/${obj.id}`, {
            method: 'DELETE',
        })
    );
    await Promise.all(deletePromises);
}

export const updateRequest = async (resource, id, body) => {
    console.log(id);
    const response = await fetch(`${baseUrl}/${resource}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    if (!(response.ok)) {
        throw new Error('Failed To Post Data');
    }
}

export const slowLoadRequest = async (resource, key, value, start, limit) => {
    const response = await fetch(`${baseUrl}/${resource}/?${key}=${value}&_start=${start}&_limit=${limit}`);
    if (!(response.ok)) {
        throw new Error('Failed To Post Data');
    }
    return response.json();
}