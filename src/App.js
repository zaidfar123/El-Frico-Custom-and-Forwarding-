// routing
// import Routes from 'routes';
import sessionRoute from 'routes/sessionRoute';
import route from 'routes/authRole/route';

// project imports
import Locales from 'ui-component/Locales';
import NavigationScroll from 'layout/NavigationScroll';
import RTLLayout from 'ui-component/RTLLayout';
import Snackbar from 'ui-component/extended/Snackbar';
import LoadingModal from 'ui-component/LoadingModal';
import ThemeCustomization from 'themes';
import AuthGuard from 'utils/route-guard/AuthGuard';
// auth provider
// import { FirebaseProvider as AuthProvider } from 'contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { Routes, Route } from 'react-router-dom';
import RequireAuth from './RequireAuth';
import "./global.css"

// const ResetPassword = 'views/pages/authentication/ResetPassword';

// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// ==============================|| APP ||============================== //

const App = () => (
    // <AppContext.Provider value={{ Routes }}>
    <ThemeCustomization>
        {/* RTL layout */}
        <RTLLayout>
            <Locales>
                <NavigationScroll>
                    <AuthProvider>
                        <>
                            <Routes>
                                {sessionRoute.map((item, i) => (
                                    <Route
                                        path={item.path}
                                        element={item.element}
                                    />
                                ))}
                                  {route.map((item, i) => (
                                      <Route element={<RequireAuth allowedRoles={item.role} />}>
                                          <Route path={item.path} element={item.element} />
                                      </Route>
                                  ))}
                            </Routes>
                        </>
                    </AuthProvider>
                </NavigationScroll>
            <Snackbar />
            <LoadingModal />
            </Locales>
        </RTLLayout>
    </ThemeCustomization>
    // </AppContext.Provider>
);

export default App;
