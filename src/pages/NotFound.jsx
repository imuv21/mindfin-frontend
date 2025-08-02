import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styles from './auth.module.css';


const NotFound = () => {
    return (
        <Fragment>
            <div className={styles.notfoundContainer}>
                <h1 className={styles.notfoundTitle}>404</h1>
                <p className={styles.notfoundSubtitle}>Oops! Page not found.</p>
                <p className={styles.notfoundMessage}>
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className={styles.notfoundHomeLink}>
                    ⬅ Go back home
                </Link>
            </div>
        </Fragment>
    );
};

export default NotFound;
