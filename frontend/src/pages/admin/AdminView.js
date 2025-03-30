import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import LogoBanner from "../../components/static/LogoBanner";
import ImageGrid from "../../components/images/ImageGrid";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {useEffect, useState} from "react";
import GenericModal from "../../components/forms/GenericModal";
import TimedAlert from "../../components/alerts/TimedAlert";

const AdminView = () => {

    const signOut = useSignOut()
    const authToken = useAuthHeader();
    const [gridTrigger, setGridTrigger] = useState(0)
    const [alerts, setAlerts] = useState([])

    const logout = () => {
        signOut()
        window.location.reload()
    }

    const fetchOrphans = () => {
        let orphans
        axios.get("/api/rest/v1/image/orphans", {headers: {Authorization: authToken}}).then(res => {
            orphans = res.data
        }).catch(err => {
            console.error(err)
        })
        return orphans
    }

    const triggerReIndex = () => {
        let orphans
        axios.post("/api/rest/v1/image/orphans/index", {}, {headers: {Authorization: authToken}})
            .then(res => {
            orphans = res.data

            console.debug("Rerender Grid (Indexed)")
            setGridTrigger(prevGridTrigger => prevGridTrigger + 1);

        }).catch(error => {
            setAlerts([...alerts, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
        })
        return orphans
    }

    useEffect(() => {

    }, []);

    const imageClickHandler = (event) => {
        let id = event.target.id
        window.location = `/admin/${id}/edit`
    }

    const uploadHandler = () => {
        console.log("Upload")
        let formData = new FormData()
        let imageFile = document.querySelector("#file")
        formData.append("image", imageFile.files[0])
        axios.put("/api/rest/v1/image/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: authToken
            }
        })
            .then(r => {
                console.log("Rerender Grid (Upload)")
                setGridTrigger(prevGridTrigger => prevGridTrigger + 1);
            })
            .catch((error) => {
                console.error(error)
                setAlerts([...alerts, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
            })
    }

    function preferences() {
        window.location = '/admin/preferences'
    }

    return(
        <>
            <LogoBanner />
            <Row className={"pb-4"}>
                <Col></Col>
                <Col className={"mx-auto"}>
                    <GenericModal showButtonText={"Upload"} titleText={"Upload a new image"} saveButtonText={"Upload"} saveHandler={uploadHandler}>
                        <Form>
                            <InputGroup>
                                <input type={"file"} id={"file"} name={"file"}/>
                            </InputGroup>
                        </Form>
                    </GenericModal>
                </Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} onClick={preferences}>Preferences</Button>
                </Col>
                <Col></Col>
            </Row>
            <Row>
                <Col></Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} onClick={logout}>Logout</Button>
                </Col>
                <Col></Col>
            </Row>
            <Row className={""}>
                <Col xs={10} className={"mx-auto"}>
                    <p className={"fst-italic text-center mb-2"}>Click on an image to edit its metadata and visibility</p>
                </Col>
            </Row>
            <Row className={"pb-3"}>
                <ImageGrid trigger={gridTrigger} api={"/api/rest/v1/image/all?showAll=true"} highlightUnpublished={true} clickHandler={imageClickHandler}/>
            </Row>
            <Row className={"pb-3"}>
                <Col xs={4} className={"mx-auto "}>
                    <Button className={"w-100"} onClick={triggerReIndex}>Reindex Files</Button>
                </Col>
            </Row>
            {alerts.map(alert => (
                <TimedAlert key={alert.id} id={`save-alert-${alert.id}`} variant={alert.variant} heading={alert.heading} dismissible={true} content={alert.content} />
            ))}
        </>
    )
}

export default AdminView