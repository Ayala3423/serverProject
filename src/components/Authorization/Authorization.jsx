import { useEffect, useContext } from 'react';
import './Authorization.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';

function Authorization({ children }) {
    const { currentUser, authorized, setAuthorized } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const userId = location.pathname.split('/')[2];

    useEffect(() => {
        if (!currentUser || !userId) {
            return;
        }
        if (String(currentUser.id) !== String(userId)) {
            setAuthorized(false);
        } else {
            setAuthorized(true);
        }
    }, [currentUser, userId]);

    const handleGoBack = () => {
        (currentUser&& String(currentUser.id) !== String(userId) && location.pathname.split('/')[2]) ? navigate(-1) : navigate(location.pathname);
        setAuthorized(true);
    };

    return (
        <>
            {authorized === false && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>You are not authorized to access this page</h2>
                        <Link to="/login" id="modal-link" onClick={() => setAuthorized(true)}>Click here to login</Link>
                        <button onClick={handleGoBack} id="modal-link">Go Back</button>
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
