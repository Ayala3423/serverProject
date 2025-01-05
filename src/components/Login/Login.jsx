import { useState, useRef, useEffect } from 'react'
import './Login.css'
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import { getRequest } from '../../ServerRequests'

export default function Login() {
    const fieldsRef = useRef({});
    const navigate = useNavigate();

    const verifyUser = async (name, password) => {
        try {
            const data = await getRequest('users', 'username', name);
            if (data[0].website === password) {
                localStorage.setItem('currentUser', JSON.stringify(data[0]));
                navigate(`/home/users/${data[0].id}`);
            }
            else {
                alert('one or more of the details is incorrect');
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (e) => {
        const name = fieldsRef.current.name.value;
        const password = fieldsRef.current.password.value;
        verifyUser(name, password);
    }

    return (
        <>
            <main className='main-login'>
                <div className="right-login">
                    <div className="card-login">
                        <h1>Login</h1>
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
                        <Link to="/signUp" className='signUp'>Dont Have An Account Yet?</Link>
                    </div>
                </div>
            </main>
        </>
    )
}
