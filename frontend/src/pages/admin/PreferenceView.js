import LogoBanner from "../../components/static/LogoBanner";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import TimedAlert from "../../components/alerts/TimedAlert";
import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import SwitchFormEntry from "../../components/forms/preferences/SwitchFormEntry";
import TextAreaFormEntry from "../../components/forms/preferences/TextAreaFormEntry";
import TextFormEntry from "../../components/forms/preferences/TextFormEntry";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Cookies from "js-cookie";
import {apiUrl} from "../../api";

const PreferenceView = () => {

    const authToken = useAuthHeader()

    const toggleTheme = () => {
        let theme = getTheme() === "dark" ? "light" : "dark"
        document.documentElement.setAttribute("data-bs-theme", theme)
    }

    const getTheme = () => {
        return document.documentElement.getAttribute("data-bs-theme")
    }

    const [alerts, setAlerts] = useState([])

    const [preferences, setPreferences] = useState([])
    const [logoFile, setLogoFile] = useState(null)
    const [artistName, setArtistName] = useState("")

    const handleSave = () => {
        // setAlerts([...alerts, { id: Date.now(), variant: "danger", heading: "Ooops not implemented!", content: "If this bothers you, send patches" }]);
        axios.post("/api/rest/v1/preferences/", preferences, {headers: {Authorization: authToken}}).then(async res => {
            if(res.status === 200){
                setAlerts(current => [...current, {id: Date.now(), variant: "success", heading: "Successfully saved preferences"}])
                const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
                Cookies.set('darkMode', preferences["darkmode"], {expires: expiryDate});
            }
        }).catch((error) => {
            setAlerts(current => [...current, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
        })
    };

    const handleReset = () => {
        axios.post("/api/rest/v1/preferences/reset", {}, {headers: {Authorization: authToken}})
            .then(() => fetchCurrentValues())
            .catch(error => {
                setAlerts(current => [...current, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
            })
    };

    const handleLogoUpload = () => {
        if (!logoFile) {
            return
        }
        const formData = new FormData()
        formData.append("logo", logoFile)
        axios.put(apiUrl("/api/rest/v1/branding/logo"), formData, {
            headers: {Authorization: authToken}
        }).then(() => {
            setAlerts(current => [...current, {
                id: Date.now(),
                variant: "success",
                heading: "Logo uploaded",
                content: "The new logo is now used as the site logo and favicon."
            }])
            window.location.reload()
        }).catch(error => {
            setAlerts(current => [...current, {
                id: Date.now(),
                variant: "danger",
                heading: "Logo upload failed",
                content: error.response?.data || error.message
            }])
        })
    }

    const fetchCurrentValues = useCallback(() => {
        Promise.all([
            axios.get("/api/rest/v1/preferences/", {headers: {Authorization: authToken}}),
            axios.get("/api/rest/v1/artist/info")
        ]).then(([preferencesResponse, artistResponse]) => {
            let sortedPreferences = {}
            Object.keys(preferencesResponse.data).sort().forEach(key => {
                sortedPreferences[key] = preferencesResponse.data[key]
            })
            setPreferences(sortedPreferences);
            setArtistName(artistResponse.data.name || "");
        }).catch((error) => {
            setAlerts(current => [...current, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
        })
    }, [authToken])

    useEffect(() => {
        fetchCurrentValues()
    }, [fetchCurrentValues]);


    const handleSwitchClick = (key) => {
        const nextValue = preferences[key] === "false" ? "true" : "false";
        setPreferences({...preferences, [key]: nextValue})
        if(key === "darkmode"){
            toggleTheme()
        }
    }

    const handleTextChange = (key, value) => {
        setPreferences({...preferences, [key]: value})
    }

    const handleArtistNameSave = () => {
        axios.put("/api/rest/v1/artist/info", {name: artistName}, {headers: {Authorization: authToken}})
            .then(() => {
                setAlerts(current => [...current, {
                    id: Date.now(),
                    variant: "success",
                    heading: "Artist name updated"
                }])
            })
            .catch(error => {
                setAlerts(current => [...current, {
                    id: Date.now(),
                    variant: "danger",
                    heading: "Artist name update failed",
                    content: error.response?.data || error.message
                }])
            })
    }

    return (
        <>
            <LogoBanner />
            <Col md={"8"} className={"mx-auto"}>
                <Form.Group className={"mb-4"} controlId={"artist-name"}>
                    <Form.Label>Artist name</Form.Label>
                    <InputGroup>
                        <Form.Control
                            type={"text"}
                            value={artistName}
                            onChange={(event) => setArtistName(event.target.value)}
                        />
                        <Button type={"button"} onClick={handleArtistNameSave} disabled={!artistName.trim()}>
                            Save name
                        </Button>
                    </InputGroup>
                </Form.Group>
                <Form.Group className={"mb-4"} controlId={"logo-upload"}>
                    <Form.Label>Logo</Form.Label>
                    <Form.Control
                        type={"file"}
                        accept={"image/png,image/jpeg,image/gif,image/webp"}
                        onChange={(event) => setLogoFile(event.target.files[0] || null)}
                    />
                    <Form.Text>Upload an image to use across the site and as the browser favicon.</Form.Text>
                    <Button className={"mt-2"} type={"button"} onClick={handleLogoUpload} disabled={!logoFile}>
                        Upload logo
                    </Button>
                </Form.Group>
                <Form className={"mb-3"}>
                    {Object.entries(preferences).map(([key, value]) => {
                        if (value === "true" || value === "false") {
                            return (
                                <SwitchFormEntry
                                    key={key}
                                    name={key}
                                    currentState={value}
                                    id={key}
                                    label={key === "include-tracking-code" ? "Include tracking code in page head" : key}
                                    clickHandler={handleSwitchClick}
                                />
                            );
                        } else if (key === "image-sort") {
                            return (
                                <InputGroup className={"mb-2"} key={key}>
                                    <InputGroup.Text>{key}</InputGroup.Text>
                                    <Form.Select
                                        aria-label="Image sorting"
                                        value={value}
                                        onChange={(event) => handleTextChange(key, event.target.value)}
                                    >
                                        <option value="capture-date-asc">Capture date (oldest first)</option>
                                        <option value="capture-date-desc">Capture date (newest first)</option>
                                        <option value="upload-date-asc">Upload date (oldest first)</option>
                                        <option value="upload-date-desc">Upload date (newest first)</option>
                                    </Form.Select>
                                </InputGroup>
                            );
                        } else if (value.length < 20) {
                            return <TextFormEntry key={key} name={key} placeholder={value} value={value} changeHandler={handleTextChange} />
                        } else {
                            return <TextAreaFormEntry key={key} name={key} placeholder={value} value={value} changeHandler={handleTextChange} height={5}/>
                        }
                    })}
                </Form>
            </Col>

            <Row className={"mb-3"}>
                <Col></Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} type={"button"} onClick={handleSave} >Save</Button>
                </Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} type={"button"} onClick={handleReset}>Reset to Defaults</Button>
                </Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} type={"button"} onClick={() => {window.location = "/admin"}}>Back</Button>
                </Col>
                <Col></Col>
            </Row>

            {alerts.map(alert => (
                <TimedAlert key={alert.id} id={`save-alert-${alert.id}`} variant={alert.variant} heading={alert.heading} dismissible={true} content={alert.content} />
            ))}
        </>
    )
}

export default PreferenceView