import React, { useState } from "react";
import "./DisplayError.css"; // הוסיפי עיצוב מתאים לחלון השגיאות

let showErrorCallback = null; // משתנה גלובלי להפעלת פונקציית הצגת שגיאות

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

    // שמירת פונקציית ה-setError כקולבק גלובלי
    showErrorCallback = (message) => {
        setError(message);
        setShow(true);
        setTimeout(() => {
            setShow(false);
            setTimeout(() => setError(null), 500); // להעלים את הטקסט לאחר האנימציה
        }, 3000); // ההודעה תוצג למשך 3 שניות
    };

    if (!error) return null;

    return (
        <div className={`error-modal ${show ? 'show' : ''}`}>
            <p>{error}</p>
        </div>
    );
};

export default DisplayError;
