import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css'

export const getAllRequest = async (resorce) => {
    const response = await fetch(`http://localhost:3000/${resorce}`);
    if (!(response.ok)) {
        throw new Error('Faild To Load Data');
    }
    return response.json();
}

export const getRequest = async (resorce, id, value) => {
    const response = await fetch(`http://localhost:3000/${resorce}/?${id}=${value}`);
    if (!(response.ok)) {
        throw new Error('Faild To Load Data');
    }
    return response.json();
}