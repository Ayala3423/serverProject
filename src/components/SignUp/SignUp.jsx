import { useState, useRef, useEffect } from 'react';
import './SignUp.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import { getRequest, createRequest } from '../../ServerRequests'

export default function SignUp() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // שליטה על שלב הטופס
    const fieldsRef = useRef({});
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
                lat: '',
                lng: ''
            },
        },
        phone: '',
        website: '',
        company: {
            name: '',
            catchPhrase: '',
            bs: ''
        },
    });

    const verifyUser = async (name, password, verifyPassword) => {
        try {
            const data = await getRequest('users', 'username', name);
            if (data[0]) {
                alert('You already have an account');
            }
            else if (password !== verifyPassword) {
                alert('Passwords do not match');
                return;
            } 
            else{
                setFormData({ ...formData, username: name, website: password });
                setStep(2);            
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleFirstStep = (e) => {
        e.preventDefault();
        const userName = fieldsRef.current.name.value;
        const password = fieldsRef.current.password.value;
        const verifyPassword = fieldsRef.current.verifyPassword.value;
        verifyUser(userName, password, verifyPassword)
    };

    const handleSecondStep = (e) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            name: fieldsRef.current.name.value,
            email: fieldsRef.current.email.value,
            address: {
                street: fieldsRef.current.street.value,
                suite: fieldsRef.current.suite.value,
                city: fieldsRef.current.city.value,
                zipcode: fieldsRef.current.zipcode.value,
                geo: {
                    lat: fieldsRef.current.lat.value,
                    lng: fieldsRef.current.lng.value,
                },
            },
            phone: fieldsRef.current.phone.value,
            company: {
                name: fieldsRef.current.companyName.value,
                catchPhrase: fieldsRef.current.catchPhrase.value,
                bs: fieldsRef.current.bs.value,
            },
        };
        (async () => {
            try {
                const data=await createRequest('users', updatedFormData);
                localStorage.setItem('currentUser', JSON.stringify(data));
                navigate(`/home/users/${data.id}`);
            } catch (error) {
                console.log(error);
            }
        })()
    };

    return (
        <main className='main-login'>
            <div className="right-login">
                <div className="card-login">
                    <h1>Sign Up</h1>
                    {step === 1 && (
                        <form onSubmit={handleFirstStep}>
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
                                <label htmlFor="verifyPassword">Verify Password</label>
                                <input
                                    type="password"
                                    name="verifyPassword"
                                    placeholder="Verify Password"
                                    required
                                    ref={(el) => (fieldsRef.current["verifyPassword"] = el)}
                                />
                            </div>
                            <button className="btn-login" type="submit">Next</button>
                            <Link to="/login" className='login'>Already Have An Account Yet?</Link>

                        </form>
                    )}
                    {step === 2 && (
                        <form onSubmit={handleSecondStep}>
                            <div className="textfield">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="name"
                                    ref={(el) => (fieldsRef.current["name"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    ref={(el) => (fieldsRef.current["email"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="Phone"
                                    required
                                    ref={(el) => (fieldsRef.current["phone"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="street">Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Street"
                                    ref={(el) => (fieldsRef.current["street"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="suite">Suite</label>
                                <input
                                    type="text"
                                    name="suite"
                                    placeholder="Suite"
                                    ref={(el) => (fieldsRef.current["suite"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="city">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="City"
                                    ref={(el) => (fieldsRef.current["city"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="zipcode">Zipcode</label>
                                <input
                                    type="text"
                                    name="zipcode"
                                    placeholder="Zipcode"
                                    ref={(el) => (fieldsRef.current["zipcode"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="lat">lat</label>
                                <input
                                    type="text"
                                    name="lat"
                                    placeholder="lat"
                                    ref={(el) => (fieldsRef.current["lat"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="lng">lng</label>
                                <input
                                    type="text"
                                    name="lng"
                                    placeholder="lng"
                                    ref={(el) => (fieldsRef.current["lng"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="website">Website</label>
                                <input
                                    type="text"
                                    name="website"
                                    placeholder="Website"
                                    ref={(el) => (fieldsRef.current["website"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="companyName">Company Name</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    placeholder="Company Name"
                                    ref={(el) => (fieldsRef.current["companyName"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="catchPhrase">Catch Phrase</label>
                                <input
                                    type="text"
                                    name="catchPhrase"
                                    placeholder="Catch Phrase"
                                    ref={(el) => (fieldsRef.current["catchPhrase"] = el)}
                                />
                            </div>
                            <div className="textfield">
                                <label htmlFor="bs">BS</label>
                                <input
                                    type="text"
                                    name="bs"
                                    placeholder="BS"
                                    ref={(el) => (fieldsRef.current["bs"] = el)}
                                />
                            </div>
                            <button className="btn-login" type="submit">Submit</button>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
