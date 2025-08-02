import { Navigate, Outlet, useLocation } from 'react-router-dom';

const Protector = ({ children, user, redirectTo = "/login", isPrivate = false }) => {
    const location = useLocation();

    // Case 1: Private route with no user
    if (isPrivate && !user) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    // Case 2: Public route with authenticated user
    if (!isPrivate && user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Case 3: Valid access
    return children ? children : <Outlet />;
};

export default Protector;