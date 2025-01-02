import axios from "axios";
import {useEffect, useState} from "react";
import {Button, Col, Form, FormCheck, FormGroup, FormText, InputGroup, Row} from "react-bootstrap";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import InputGroupText from "react-bootstrap/InputGroupText";

const ImageEditor = (props) => {

    const [imageStatus, setImageStatus] = useState({})
    const authToken = useAuthHeader();
    const [newImageStatus, setNewImageStatus] = useState({});

    const loadCurrentImageStatus = () => {
        axios.get(`/api/rest/v1/image/${props.id}`, {headers: {Authorization: authToken}})
            .then(res => {
                setImageStatus(res.data)
                setNewImageStatus(res.data)
                console.debug(newImageStatus)
            })
            .catch(err => {
                console.error(err)
            })
    }

    const checkHandler = (event) => {
        setNewImageStatus({
            ...newImageStatus,
            [event.target.name]: event.target.checked
        })
        console.debug(newImageStatus)
    }

    const changeHandler = (event) => {
        setNewImageStatus({
            ...newImageStatus,
            [event.target.name]: event.target.value
        })
        console.debug(newImageStatus)
    }

    useEffect(() => {
        loadCurrentImageStatus()
        console.debug("ImageStatusBar rendered")
    }, [props.trigger]);

    const submitHandler = (event) => {
        console.debug("Submit")
        props.submitHandler(event, newImageStatus)
    }

    return(
        <>
            <Form onSubmit={submitHandler}>
                <Row className={"pb-3"}>
                    <Col xs={"auto"} className={"pb-2 px-1"}>
                        <InputGroup>
                            <InputGroup.Checkbox type={"checkbox"} id={"publishedCheck"}
                                                 checked={newImageStatus.published} onChange={checkHandler}
                                                 name={"published"}>
                            </InputGroup.Checkbox>
                            <InputGroupText>Published</InputGroupText>
                        </InputGroup>
                    </Col>
                    <Col xs={12} sm={8} md={9} lg={5} className={"pb-2 px-1"}>
                        <InputGroup>
                            <InputGroup.Text >Title</InputGroup.Text>
                            <Form.Control name={"title"} onChange={changeHandler} value={newImageStatus.title}/>
                        </InputGroup>
                    </Col>
                    <Col sm={12} lg={5} className={"pb-2 px-1"}>
                        <InputGroup>
                            <InputGroup.Text>Description</InputGroup.Text>
                            <Form.Control name={"description"} as="textarea"
                                          aria-label="With textarea" onChange={changeHandler}
                                          value={newImageStatus.description}/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                    <Col xs={4} sm={3} md={2} className={"mx-auto"}>
                        <Button variant={"primary"} className={"w-100"} type={"submit"}>Save</Button>
                    </Col>
                </Row>
            </Form>
        </>

    )
}

export default ImageEditor