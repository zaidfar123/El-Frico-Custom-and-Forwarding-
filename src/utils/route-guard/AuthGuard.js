import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';

// ==============================|| AUTH GUARD ||============================== //

/**
 * Authentication guard for routes
 * @param {PropTypes.node} children children element/node
 */
const AuthGuard = ({ children }) => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation()
    
    useEffect(() => {
        if(pathname === "/"){
            navigate('/', { replace: true });
        }
        
    }, [isLoggedIn, navigate]);

    return children;
};

AuthGuard.propTypes = {
    children: PropTypes.node
};

export default AuthGuard;