import LogoBanner from "../../components/static/LogoBanner";
import LoginForm from "../../components/forms/LoginForm";
import {useEffect} from "react";
import axios from "axios";

const LoginView = () => {

    useEffect(() => {
        checkOnboardingAllowed()
    }, []);

    let checkOnboardingAllowed = () => {
        axios.get("/api/rest/v1/artist/auth/onboarding")
            .then(res => {
                if(res.status === 200){
                    window.location = "/admin/onboarding"
                }
            }).catch(error => {
                console.error(error)
            }
        )
    }

    return(
        <>
            <LogoBanner />
            <LoginForm />
        </>
    )
}

export default LoginView