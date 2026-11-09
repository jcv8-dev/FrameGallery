import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import LogoBanner from "../../components/static/LogoBanner";
import ImageGrid from "../../components/images/ImageGrid";
import useSignOut from "react-auth-kit/hooks/useSignOut";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {useState} from "react";
import GenericModal from "../../components/forms/GenericModal";
import TimedAlert from "../../components/alerts/TimedAlert";
import {apiUrl} from "../../api";

const AdminView = () => {

    const signOut = useSignOut()
    const authToken = useAuthHeader();
    const [gridTrigger, setGridTrigger] = useState(0)
    const [alerts, setAlerts] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [optimisticIds, setOptimisticIds] = useState([])
    const [publishedIds, setPublishedIds] = useState([])

    const logout = () => {
        signOut()
        window.location.reload()
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

    const imageClickHandler = (event) => {
        let id = event.target.id
        window.location = `/admin/${id}/edit`
    }

    const uploadHandler = async () => {
        const fileInput = document.querySelector("#file")
        const imageFiles = Array.from(fileInput?.files || [])
        const failures = []

        for (const file of imageFiles) {
            const formData = new FormData()
            formData.append("image", file)

            try {
                const response = await axios.put("/api/rest/v1/image/add", formData, {
                    headers: {Authorization: authToken}
                })
                setOptimisticIds(current => [...new Set([...current, response.data.id])])
            } catch (error) {
                console.error(`Could not upload ${file.name}`, error)
                failures.push(file.name)
            }
        }

        if (fileInput) {
            fileInput.value = ""
        }
        setGridTrigger(prevGridTrigger => prevGridTrigger + 1)

        if (failures.length > 0) {
            setAlerts(current => [...current, {
                id: Date.now(),
                variant: "danger",
                heading: "Some images could not be uploaded",
                content: failures.join(", ")
            }])
        }
    }

    const publishSelected = () => {
        axios.post("/api/rest/v1/image/bulk/publish", selectedIds, {
            headers: {Authorization: authToken}
        }).then(() => {
            setPublishedIds(current => [...new Set([...current, ...selectedIds])])
            setSelectedIds([])
            setGridTrigger(prev => prev + 1)
        }).catch(error => {
            setAlerts([...alerts, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
        })
    }

    const deleteSelected = () => {
        if (!window.confirm(`Delete ${selectedIds.length} selected image(s)?`)) {
            return
        }
        axios.post("/api/rest/v1/image/bulk/delete", selectedIds, {
            headers: {Authorization: authToken}
        }).then(() => {
            const deletedIds = new Set(selectedIds);
            setSelectedIds([])
            setOptimisticIds(current => current.filter(id => !deletedIds.has(id)))
            setGridTrigger(prev => prev + 1)
        }).catch(error => {
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
                                <input type={"file"} id={"file"} name={"file"} multiple accept={"image/*"}/>
                            </InputGroup>
                        </Form>
                    </GenericModal>
                </Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} onClick={preferences}>Preferences</Button>
                </Col>
                <Col className={"mx-auto"}>
                    <Button
                        as={"a"}
                        href={apiUrl("/api/docs/swagger-ui.html")}
                        className={"w-100"}
                    >
                        Documentation
                    </Button>
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
                <Col xs={12} className={"d-flex gap-2 mb-2"}>
                    <Button disabled={selectedIds.length === 0} onClick={publishSelected}>Publish selected</Button>
                    <Button variant={"danger"} disabled={selectedIds.length === 0} onClick={deleteSelected}>Delete selected</Button>
                </Col>
                <ImageGrid
                    trigger={gridTrigger}
                    api={"/api/rest/v1/image/all?showAll=true"}
                    highlightUnpublished={true}
                    clickHandler={imageClickHandler}
                    selectable={true}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    optimisticIds={optimisticIds}
                    publishedIds={publishedIds}
                    showTranscodingStatus={true}
                    onTranscodingComplete={id => {
                        setOptimisticIds(current => current.filter(imageId => imageId !== id))
                    }}
                />
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