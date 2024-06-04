import { useContext } from 'react';

// auth provider
// import AuthContext from 'contexts/FirebaseContext';
// import AuthContext from 'contexts/Auth0Context';
import AuthContext from 'contexts/JWTContext';
// import AuthContext from 'contexts/AWSCognitoContext';

// ==============================|| AUTH HOOKS ||============================== //

const useAuth = () => useContext(AuthContext);

export default useAuth;
