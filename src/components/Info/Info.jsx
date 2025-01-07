import { useContext } from 'react';
import './Info.css';
import { UserContext } from '../../App';

function Info() {
    const { currentUser } = useContext(UserContext);
    return (
        <>
            {currentUser && (
                <div className="user-card">
                    <h2>{currentUser.name}</h2>
                    <p className="username">{currentUser.username}</p>
                    <p><b>Email:</b> {currentUser.email}</p>
                    <p><b>Phone:</b> {currentUser.phone}</p>

                    <div className="address">
                        <h3>Address</h3>
                        <p>{currentUser.address.street}, {currentUser.address.suite}</p>
                        <p>{currentUser.address.city}, {currentUser.address.zipcode}</p>
                        <p><b>Coordinates:</b> {currentUser.address.geo.lat}, {currentUser.address.geo.lng}</p>
                    </div>

                    <div className="company">
                        <h3>Company</h3>
                        <p><b>Name:</b> {currentUser.company.name}</p>
                        <p><b>Catchphrase:</b> {currentUser.company.catchPhrase}</p>
                        <p><b>Business:</b> {currentUser.company.bs}</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default Info;
