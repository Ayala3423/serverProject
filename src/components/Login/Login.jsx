import { useState, useRef, useEffect } from 'react'
import './Login.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function Login() {
    const fieldsRef = useRef({})
    
    useEffect(()=>{
        fetch('../db.json')
        .then((response)=> response.json())
        .then((data)=>console.log(data.users))
    }, [])
    
    const handleSubmit = (e) => {
        e.preventdefault();
        if(fieldsRef.current.name.value){

        }
    }
    return (
        <>
        <form onSubmit={handleSubmit}>
                <div className="textfield">
                    <label htmlFor="user">User</label>
                    <input
                        type="text"
                        name="user"
                        placeholder="User"
                        required
                        ref={(el) => (fieldsRef.current["name"] = el)}
                    />
                </div>
                <div className="textfield">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        ref={(el) => (fieldsRef.current["password"] = el)}
                    />
                </div>
                <button className="btn-login" type="submit">
                    Login
                </button>
            </form>
        </>
    )
}
