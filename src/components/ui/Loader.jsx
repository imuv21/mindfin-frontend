import React, { useEffect, useState } from 'react';
import "../../Telecaller/telecaller.css";


const Loader = () => {

    const messages = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setMessage(messages[i]);
            i = (i + 1) % messages.length;
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loaderCont">
            <div className="loader"></div>
            <p className='loaderText'>{message}</p>
        </div>
    );
};

export default Loader;