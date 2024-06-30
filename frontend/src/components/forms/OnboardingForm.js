import {Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import {useState} from "react";
const OnboardingForm = () => {

    const [state, setState] = useState({})

    let handleChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log(state)
    }

    let handleSubmit = event => {

        event.preventDefault();

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
                console.error(error)
        })
    }

    return (
        <>
            <Row>
                <Col xs={10} sm={8} md={6} className={"mx-auto"}>
                    <Form>
                        <div className={"mb-3"}>
                            <p className={"text-center fst-italic mb-1"}>Please enter your Name. It will be used for copyright notices and branding.</p>
                            <Form.Group className={"mb-3"} controlId={"name"}>
                                <Form.Control type={"text"} placeholder={"Name"} name={"name"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                        </div>

                        <div className={"mb-3"}>
                            <p className={"text-center fst-italic mb-1"}>Please choose a username and password to authenticate with in the future</p>
                            <Form.Group className={"mb-3"} controlId={"username"}>
                                <Form.Control type={"text"} placeholder={"Username"} name={"username"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                            <Form.Group className={"mb-3"} controlId={"password"}>
                                <Form.Control type={"password"} placeholder={"Password"} name={"password"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                            <Form.Group className={"mb-3"} controlId={"passwordVerify"}>
                                <Form.Control type={"password"} placeholder={"Verify Password"} name={"passwordVerify"} onChange={handleChange}></Form.Control>
                            </Form.Group>
                        </div>

                        <Button variant="primary" type="button" className={"w-100"} onClick={handleSubmit} >
                            Start using FrameGallery
                        </Button>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default OnboardingForm