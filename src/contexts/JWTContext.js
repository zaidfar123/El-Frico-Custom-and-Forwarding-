import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { assignedScreen } from 'store/slices/assignScreen';
import { useDispatch } from 'react-redux';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';

const chance = new Chance();
import AxiosServices from "service"
// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const navigate = useNavigate();
    const dispatcher = useDispatch();

    useEffect(() => {
        const init = async () => {

            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken) {
                    setSession(serviceToken);
                    // const response = await axios.get('/api/account/me');
                    // const { user } = response.data;
                    var user = JSON.parse(window.localStorage.getItem("user"))


                    const responsesScreen = await AxiosServices.getUserScreen({ roleID: user.roleID });
                    var { data } = responsesScreen?.data;
                    dispatcher(assignedScreen({ model: JSON.parse(data[0].accessScreenArray) }))

                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user
                        }
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email, password) => {
        // const response = await axios.post('/api/account/login', { email, password });
        const response = await AxiosServices.loginUser({ email, password });

        const { message } = response?.data;

        // setSession(serviceToken);
        // localStorage.setItem("user", JSON.stringify(user));
        // dispatch({
        //     type: LOGIN,
        //     payload: {
        //         isLoggedIn: true,
        //         user
        //     }
        // });

        // navigate('/', { replace: true });
        // window.location.reload(false);
        return message;

    };
    const loginOTP = async (model) => {

        const response = await AxiosServices.verifyOTPLogin(model);
        var { message, data } = response?.data;

        if (message === "Login Successfully.") {

            var user = {
                id: data.userID,
                email: data.email,
                name: data.userDetailName,
                role: data.roleName,
                city: data.city,
                phone: data.mobileNo,
                roleID: data.role_ID
            }
            debugger

            localStorage.setItem("user", JSON.stringify(user));
            setSession(data.token)

            const responsesScreen = await AxiosServices.getUserScreen({ roleID: data.role_ID });
            var { data } = responsesScreen?.data;

            dispatcher(assignedScreen({ model: JSON.parse(data[0].accessScreenArray) }))

            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user
                }
            });

            navigate('/', { replace: true });
            window.location.reload(false);

        }
        else {
            return message;
        }

    };

    const register = async (email, password, firstName, lastName) => {
        // todo: this flow need to be recode as it not verified
        const id = chance.bb_pin();
        const response = await axios.post('/api/account/register', {
            id,
            email,
            password,
            firstName,
            lastName
        });
        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers),
                {
                    id,
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        // setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = (email) => console.log(email);

    const updateProfile = () => { };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile, loginOTP }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
