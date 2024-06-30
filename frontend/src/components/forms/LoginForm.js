import { Button, Col, Form, Row} from "react-bootstrap";
import axios from "axios";
import React, {useState} from "react";
import CustomAlert from "../CustomAlert";
import useSignIn from "react-auth-kit/hooks/useSignIn";

const LoginForm = () => {

    const [state, setState] = useState({});
    let signIn = useSignIn()

    let handleChange = (event) => {
        const { name, value } = event.target;
        setState(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    let handleSubmit = (event) => {

        event.preventDefault();

        const authRequest = {
            username: state.username,
            password: state.password
        };

        axios.post(`/api/rest/v1/artist/auth/login`, JSON.stringify(authRequest))
            .then(async res => {
                if(res.status === 200){
                    if(signIn({
                        auth: {
                            token: res.data.token,
                            type: 'Bearer'
                        }
                    })){
                        window.location = "/admin"
                    }
                }
            }).catch((error) => {
            if (error.response) {
                setState({error: "Login failed: " + error.response.status})
            }
        });
    }


    return (
        <>
            <Row>
                <Col xs={10} sm={8} md={4} className={"mx-auto"}>
                    <Form>
                        <Form.Group className={"mb-3"} controlId={"loginUsername"}>
                            <Form.Control name="username" type={"text"} placeholder={"Username"} onChange={handleChange}></Form.Control>
                        </Form.Group>
                        <Form.Group className={"mb-3"} controlId={"loginPassword"}>
                            <Form.Control name={"password"} type={"password"} placeholder={"Password"} onChange={handleChange}></Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="button" className={"w-100"} onClick={handleSubmit} >
                            Login
                        </Button>
                    </Form>
                    <CustomAlert variant={"warning"}>{state.error !== undefined ? state.error.toString() : ""}</CustomAlert>
                </Col>
            </Row>
        </>
    )



}

export default LoginForm