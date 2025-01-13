import React, { useState } from "react";
import "./DisplayError.css";

let showErrorCallback = null;

export const triggerError = (message) => {
    if (showErrorCallback) {
        showErrorCallback(message);
    } else {
        console.error("Error DisplayError not initialized:", message);
    }
};

const DisplayError = () => {
    const [error, setError] = useState(null);
    const [show, setShow] = useState(false);

    showErrorCallback = (message) => {
        setError(message);
        setShow(true);
        setTimeout(() => {
            setShow(false);
            setTimeout(() => setError(null), 500);
        }, 3000);
    };

    if (!error) return null;

    return (
        <div className={`error-modal ${show ? 'show' : ''}`}>
            <p>{error}</p>
        </div>
    );
};

export default DisplayError;
