import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from 'hooks/useAuth';
import MainLayout from 'layout/MainLayout';

const RequireAuth = ({ allowedRoles }) => {
    const { user,isLoggedIn } = useAuth();
    const location = useLocation();

    return (
        allowedRoles?.includes(user?.role)
            ? <MainLayout />
            : isLoggedIn
                ? <Navigate to="/Unauthorized" state={{ from: location }} replace />
                : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;