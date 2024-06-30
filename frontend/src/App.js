import './App.css';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'

import {BrowserRouter, Route, Routes} from "react-router-dom";
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

// axios.defaults.baseURL = 'http://localhost:8080';
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
            <Container fluid={"xl"} style={{minHeight: "91vh", maxWidth: "90vw"}} >
                <AuthProvider store={store}>
                    <BrowserRouter>
                        <Routes>
                            <Route path={"/"} element={<HomeView/>}></Route>
                            <Route path={"/image/:id"} element={<ImageView/>}></Route>
                            <Route path={"/admin/login"} element={<LoginView/>}></Route>
                            <Route path={"/admin/onboarding"} element={<OnboardingView/>}></Route>
                            <Route element={<AuthOutlet fallbackPath='/admin/login' />}>
                                <Route path={"/admin"} element={<AdminView/>}></Route>
                                <Route path={"/admin/:id/edit"} element={<ImageEditView/>}></Route>
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            </Container>
            <Footer></Footer>
        </>
    );
}

export default App;
