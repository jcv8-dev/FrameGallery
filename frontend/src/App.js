import './App.css';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'

import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import AdminView from "./pages/admin/AdminView";
import HomeView from "./pages/HomeView";
import ImageEditView from "./pages/admin/ImageEditView";
import ImageView from "./pages/ImageView";
import LoginView from "./pages/admin/LoginView";
import createStore from 'react-auth-kit/createStore';
import AuthProvider from "react-auth-kit";
import OnboardingView from "./pages/admin/OnboardingView";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from "react-bootstrap";
import Footer from "./components/static/Footer";
import axios from "axios";
import PreferenceView from "./pages/admin/PreferenceView";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

function App() {
    const store = createStore({
        authName:'_auth',
        authType:'cookie',
        cookieDomain: window.location.hostname,
        cookieSecure: window.location.protocol === 'https:',
    });

    return (
        <>
            <Container fluid={"xl"} style={{ minHeight: "87vh", maxWidth: "90vw" }}>
                <BrowserRouter>
                    <AuthProvider store={store}>
                        <Routes>
                            <Route path="/" element={<HomeView />} />
                            <Route path="/image/:id" element={<ImageView />} />
                            <Route path="/admin/login" element={<LoginView />} />
                            <Route path="/admin/onboarding" element={<OnboardingView />} />
                            {/*<Route element={<AuthOutlet fallbackPath="/admin/login" />}>*/}
                                <Route path="/admin" element={<AdminView />} />
                                <Route path="/admin/preferences" element={<PreferenceView />} />
                                <Route path="/admin/:id/edit" element={<ImageEditView />} />
                            {/*</Route>*/}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </AuthProvider>
                </BrowserRouter>
            </Container>
            <Footer />
        </>
    );
}

export default App;
