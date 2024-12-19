import { useState, useRef, useEffect} from 'react'
import './Login.css'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
    const fieldsRef = useRef({})
    const navigate=useNavigate();
    let users;
    useEffect(() => {
        fetch('http://localhost:3000/users')
            .then((response) => response.json())
            .then((data) => { users = data })
    }, [])

    const handleSubmit = (e) => {
        const name = fieldsRef.current.name.value;
        const password = fieldsRef.current.password.value;
        const foundUser= users.find(user => user.username === name && user.website === password);
        if (!foundUser) {
            alert('one or more of the details is incorrect');
        }
        else {
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            navigate(`/home/users/${foundUser.id}`);
        }
    }
    return (
        <>
            <main>
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
                <button className="btn-login" type="submit" onClick={handleSubmit}>Login</button>
            </main>
        </>
    )
}
