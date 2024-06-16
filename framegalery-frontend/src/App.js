import './App.css';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet'

import {BrowserRouter, Route, Routes} from "react-router-dom";
import AdminView from "./pages/admin/AdminView";
import HomeView from "./pages/HomeView";
import IngestView from "./pages/admin/IngestView";
import ImageView from "./pages/ImageView";
import LoginView from "./pages/admin/LoginView";
import createStore from 'react-auth-kit/createStore';
import AuthProvider from "react-auth-kit";

function App() {
    const store = createStore({
        authName:'_auth',
        authType:'cookie',
        cookieDomain: window.location.hostname,
        cookieSecure: window.location.protocol === 'https:',
    });

    return (
        <AuthProvider store={store}>
            <BrowserRouter>
                <Routes>
                    <Route path={"/"} element={<HomeView/>}></Route>
                    <Route path={"/image/:id"} element={<ImageView/>}></Route>
                    <Route path={"/admin/login"} element={<LoginView/>}></Route>
                    <Route element={<AuthOutlet fallbackPath='/admin/login' />}>
                        <Route path={"/admin"} element={<AdminView/>}></Route>
                        <Route path={"/admin/ingest"} element={<IngestView/>}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
