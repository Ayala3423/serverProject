import { useState, useEffect, useContext } from 'react';
import './Authorization.css';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

function Authorization({ children }) {
    const { currentUser, authorized, setAuthorized } = useContext(UserContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        
        if (!currentUser || !userId) {
            return;
        }
        alert(currentUser.id)
        alert(userId)
        if (String(currentUser.id) !== String(userId)) {
            setAuthorized(false);
        } else {
            setAuthorized(true);
        }
    }, [currentUser, userId]);

    const handleGoBack = () => {
        navigate(-1); // חזרה לעמוד הקודם
        setAuthorized(true);
    };

    return (
        <>
            {authorized === null && <div>Loading...</div>}
            {authorized === false && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>You are not authorized to access this page</h2>
                        <Link to="/login" className="modal-link" onClick={()=>setAuthorized(true)}>Click here to login</Link>
                        <button onClick={handleGoBack} className="modal-link">
                            Go Back
                        </button>
                    </div>
                </div>
            )}
            <div className={authorized === false ? 'blur-content' : ''}>
                {children}
            </div>
        </>
    );
}

export default Authorization;
