import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useState} from "react";
import CustomAlert from "../alerts/CustomAlert";
const OnboardingForm = () => {

    const [state, setState] = useState({})
    const [error, setError] = useState("")

    let handleChange = (event) => {
        const { name, value } = event.target;
        setError("")
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    let handleSubmit = event => {

        event.preventDefault();

        if (state.password !== state.passwordVerify) {
            setError("Passwords must match.")
            return
        }

        const registerRequest = {
            name: state.name,
            username: state.username,
            password: state.password
        };

        axios.post(`/api/rest/v1/artist/auth/register`, JSON.stringify(registerRequest))
            .then(res => {
                if(res.status === 201){
                    window.location = "/admin/login"
                }
            }).catch(error => {
                setError(error.response?.data || "Registration failed.")
        })
    }

    return (
        <>
            <Row>
                <Col xs={10} sm={8} md={6} className={"mx-auto"}>
                    <Form onSubmit={handleSubmit}>
                        <div className={"mb-3"}>
                            <p className={"text-center fst-italic mb-1"}>Please enter your Name. It will be used for copyright notices and branding.</p>
                            <Form.Group className={"mb-3"} controlId={"name"}>
                                <Form.Control required type={"text"} placeholder={"Name"} name={"name"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                        </div>

                        <div className={"mb-3"}>
                            <p className={"text-center fst-italic mb-1"}>Please choose a username and password to authenticate with in the future</p>
                            <Form.Group className={"mb-3"} controlId={"username"}>
                                <Form.Control required type={"text"} placeholder={"Username"} name={"username"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                            <Form.Group className={"mb-3"} controlId={"password"}>
                                <Form.Control required minLength={8} type={"password"} placeholder={"Password (minimum 8 characters)"} name={"password"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                            <Form.Group className={"mb-3"} controlId={"passwordVerify"}>
                                <Form.Control required minLength={8} type={"password"} placeholder={"Verify Password"} name={"passwordVerify"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                        </div>

                        <CustomAlert variant={"danger"} heading={"Unable to create account"} dismissible={false}>
                            {error}
                        </CustomAlert>
                        <Button variant="primary" type="submit" className={"w-100"} >
                            Start using FrameGallery
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default OnboardingForm