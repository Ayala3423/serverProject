import { useState, useEffect, useContext } from 'react';
import './Authorization.css';
import { useParams } from 'react-router-dom';
import { deleteRequest, updateRequest } from '../../ServerRequests';
import { UserContext } from '../../App';

function Authorization() {
    const { currentUser } = useContext(UserContext);
    const [isAuthorized, setIsAuthorized] = useState(true);
    const { userId } = useParams();

    useEffect(() => {
        alert(currentUser)
        alert(userId)
        if (currentUser?currentUser.id !== userId:false)
            setIsAuthorized(false)
    }, [userId]);

    return (
        <>
            {!isAuthorized && <div>
                <h2>you are not autherized to do that
                </h2>
            </div>}
        </>
    );
}

export default Authorization;