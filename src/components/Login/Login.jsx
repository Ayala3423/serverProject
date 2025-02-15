import { useRef, useContext } from 'react'
import './Login.css'
import { Link, useNavigate } from "react-router-dom";
import { getRequest } from '../../ServerRequests'
import { UserContext } from '../../App';
import { triggerError } from "../DisplayError/DisplayError";

export default function Login() {
    const fieldsRef = useRef({});
    const navigate = useNavigate();
    const { setCurrentUser } = useContext(UserContext);

    const verifyUser = async (name, password) => {
        try {
            const data = await getRequest('users', 'username', name);
            if (data[0].website === password) {
                localStorage.setItem('currentUser', JSON.stringify(data[0]));
                setCurrentUser(data[0]);
                navigate(`/users/${data[0].id}/home`);
            }
            else {
                triggerError('one or more of the details is incorrect');
            }
        } catch (error) {
            triggerError(error);
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
                        <Link to="/register" className='signUp'>Dont Have An Account Yet?</Link>
                    </div>
                </div>
            </main>
        </>
    )
    
}
