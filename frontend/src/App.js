import './App.css';

import {BrowserRouter as Router, Route, Routes, Navigate, useParams} from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'; // Hook to check authentication status

import AdminView from "./pages/admin/AdminView";
import HomeView from "./pages/HomeView";
import ImageEditView from "./pages/admin/ImageEditView";
import ImageView from "./pages/ImageView";
import LoginView from "./pages/admin/LoginView";
import OnboardingView from "./pages/admin/OnboardingView";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import Footer from "./components/static/Footer";
import axios from "axios";
import PreferenceView from "./pages/admin/PreferenceView";
import AuthProvider from "react-auth-kit";
import createStore from "react-auth-kit/createStore";
import {cloneElement, useEffect} from "react";
import Cookies from 'js-cookie';
import {apiUrl} from "./api";
import {installButtonTracking, installTrackingCode} from "./tracking";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const store = createStore({
    authName:'_auth',
    authType:'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:',
});

const ProtectedRoute = ({children}) => {
    let {id} = useParams()
    const isAuthenticated = useIsAuthenticated();
    return isAuthenticated ? cloneElement(children, { id: id }) : <Navigate to="/admin/login" />;
}

const App = () => {

    useEffect(() => {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = `${apiUrl("/api/rest/v1/branding/logo")}?v=${Date.now()}`;
        }

        const fetchPreferences = () => {
            axios.get('/api/rest/v1/preferences/').then(response => {
                const darkModeEnabled = response.data.darkmode === "true";
                installTrackingCode(response.data["tracking-code"], response.data["include-tracking-code"] === "true");
                const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
                Cookies.set('darkMode', darkModeEnabled, {expires: expiryDate});
                document.documentElement.setAttribute('data-bs-theme', darkModeEnabled ? 'dark' : 'light');
                document.documentElement.style.colorScheme = darkModeEnabled ? 'dark' : 'light';
            }).catch(error => {
                console.error('Error fetching preferences:', error);
            })
        };

        const removeButtonTracking = installButtonTracking();

        const cachedDarkMode = Cookies.get('darkMode');
        if (cachedDarkMode !== undefined) {
            document.documentElement.setAttribute('data-bs-theme', cachedDarkMode === 'true' ? 'dark' : 'light');
            fetchPreferences();
        } else {
            fetchPreferences();
        }
        return removeButtonTracking;
    }, []);

    return (
        <>
            <Container fluid={"xl"} style={{ minHeight: "87vh", maxWidth: "90vw" }}>
                <AuthProvider store={store}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<HomeView />} />
                            <Route path="/image/:id" element={<ImageView />} />
                            <Route path="/admin/login" element={<LoginView />} />
                            <Route path="/admin/onboarding" element={<OnboardingView />} />

                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute>
                                        <AdminView />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/preferences"
                                element={
                                    <ProtectedRoute>
                                        <PreferenceView />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/admin/:id/edit"
                                element={
                                    <ProtectedRoute >
                                        <ImageEditView />
                                    </ProtectedRoute>
                                }
                            />
                            {/*404*/}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                        <Footer />
                    </Router>
                </AuthProvider>
                </Container >
        </>
    );
}

export default App;
