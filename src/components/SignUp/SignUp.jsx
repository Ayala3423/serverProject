import { useState, useRef, useEffect } from 'react'
import './SignUp.css'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";

export default function SignUp() {
    const fieldsRef = useRef({});
    const navigate = useNavigate();
    let users;

    useEffect(() => {
        fetch('http://localhost:3000/users')
            .then((response) => response.json())
            .then((data) => { users = data })
    }, [])

    const checkData = (e) => {
        const name = fieldsRef.current.name.value;
        const password = fieldsRef.current.password.value;
        const verifyPassword = fieldsRef.current.verifyPassword.value;
        const foundUser = users.find(user => user.username === name);
        if (foundUser) {
            alert('You allready have an account');
        }
        else {
            if (password != verifyPassword) {
                alert('password doesnt match]');
            }
            else {
                navigate(`/home/users/${foundUser.id}`);//אני שומרת את זה לעוד מעט
            }
        }
    }

    const handleSubmit = (e) => {

        navigate(`/home/users/${foundUser.id}`);//הוספת פרטי משתמש

    }

    return (
        <>
            <main className='main-login'>
                <div className="right-login">
                    <div className="card-login">
                        <h1>Sign Up</h1>
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
                        <div className="textfield">
                            <label htmlFor="password">Verify Password</label>
                            <input
                                type="password"
                                name="verifyPassword"
                                placeholder="verifyPassword"
                                required
                                ref={(el) => (fieldsRef.current["verifyPassword"] = el)}
                            />
                        </div>
                        <button className="btn-login" type="submit" onClick={checkData}>Login</button>
                        <Link to="/login" className='loginLink'>Allready Have An Account?</Link>
                    </div>
                </div>
            </main>
        </>
    )
}
