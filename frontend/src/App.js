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

// axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
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
        const fetchDarkModeStatus = () => {
            axios.get('/api/rest/v1/preferences/darkmode').then(response => {
                let darkModeEnabled = response.data
                const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
                Cookies.set('darkMode', darkModeEnabled, {expires: expiryDate});
                document.documentElement.setAttribute('data-bs-theme', darkModeEnabled ? 'dark' : 'light');
            }).catch(error => {
                console.error('Error fetching dark mode status:', error);
            })
        };

        const cachedDarkMode = Cookies.get('darkMode');
        if (cachedDarkMode !== undefined) {
            document.documentElement.setAttribute('data-bs-theme', cachedDarkMode === 'true' ? 'dark' : 'light');
        } else {
            fetchDarkModeStatus();
        }
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
                    </Router>
                </AuthProvider>
                </Container >
            <Footer />
        </>
    );
}

export default App;
