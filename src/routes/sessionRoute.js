import { lazy } from 'react';
import { authRoles } from './authRole/authRoles'

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
const Login = Loadable(lazy(() => import('views/pages/authentication/login/Login')));
const AuthCodeVerification = Loadable(lazy(() => import('views/pages/authentication/login/CodeVerification')));

// const LoginLoreal = Loadable(lazy(() => import('views/pages/authentication/LoginLoreal')));
// const AuthRegister = Loadable(lazy(() => import('views/pages/authentication/Register')));
// const AuthForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
// const AuthCodeVerification = Loadable(lazy(() => import('views/pages/authentication/CodeVerification')));
// const ResetPassword = Loadable(lazy(() => import('views/pages/authentication/ResetPassword')));
// const ForgotPassword = Loadable(lazy(() => import('views/pages/authentication/ForgotPassword')));
// const Unauthorize = Loadable(lazy(() => import('views/pages/authentication/Unauthorize')));

const sessionRoute =
    [
        {
            path: '/login',
            element: <Login />
        },
        {
            path: '/CodeVerification',
            element: <AuthCodeVerification />
        },
        // {
        //     path: '/register',
        //     element: <AuthRegister />
        // },
        // {
        //     path: '/forgot',
        //     element: <AuthForgotPassword />
        // },
        // {
        //     path: '/CodeVerification',
        //     element: <AuthCodeVerification />
        // },
        // {
        //     path: '/reset-password/:ResetKey',
        //     element: <ResetPassword />
        // },
        // {
        //     path: '/forgot-password',
        //     element: <ForgotPassword />
        // },
        // {
        //     path: '/Unauthorized',
        //     element: <Unauthorize />
        // },
    ];

export default sessionRoute;
