import {useEffect} from "react";
import LogoBanner from "../../components/static/LogoBanner";
import OnboardingForm from "../../components/forms/OnboardingForm";
import {Col, Row} from "react-bootstrap";
import axios from "axios";

const OnboardingView = () => {

    useEffect(() => {
        checkOnboardingAllowed()

    }, []);

    let checkOnboardingAllowed = () => {
        axios.get("/api/rest/v1/artist/auth/onboarding")
            .then(res => {
                if(res.status !== 200){
                    window.location = "/admin/login"
                }
            }).catch(error => {
                console.error(error)
                window.location = "/admin/login"
            }
        )
    }

    return(
        <>
            <LogoBanner />
            <Row>
                <Col xs={10} sm={8} md={4} className={"mx-auto"}>
                    <p className={"text-center fw-bold"}>Welcome to FrameGallery</p>
                </Col>
            </Row>
            <OnboardingForm />
        </>
    )
}
export default OnboardingView