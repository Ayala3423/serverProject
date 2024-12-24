import { useState } from 'react'
import './Info.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Info() {
    const user = JSON.parse(localStorage.getItem('currentUser'))
    return (
        <div className="user-card">
            <h2>{user.name}</h2>
            <p className="username">{user.username}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone}</p>

            <div className="address">
                <h3>Address</h3>
                <p>{user.address.street}, {user.address.suite}</p>
                <p>{user.address.city}, {user.address.zipcode}</p>
                <p><b>Coordinates:</b> {user.address.geo.lat}, {user.address.geo.lng}</p>
            </div>

            <div className="company">
                <h3>Company</h3>
                <p><b>Name:</b> {user.company.name}</p>
                <p><b>Catchphrase:</b> {user.company.catchPhrase}</p>
                <p><b>Business:</b> {user.company.bs}</p>
            </div>
        </div>
    );
}

export default Info;

