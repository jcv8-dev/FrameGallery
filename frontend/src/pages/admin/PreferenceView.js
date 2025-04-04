import LogoBanner from "../../components/static/LogoBanner";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import TimedAlert from "../../components/alerts/TimedAlert";
import {useEffect, useState} from "react";
import axios from "axios";
import SwitchFormEntry from "../../components/forms/preferences/SwitchFormEntry";
import TextAreaFormEntry from "../../components/forms/preferences/TextAreaFormEntry";
import TextFormEntry from "../../components/forms/preferences/TextFormEntry";
import {map} from "react-bootstrap/ElementChildren";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Cookies from "js-cookie";

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

    const handleSave = () => {
        // setAlerts([...alerts, { id: Date.now(), variant: "danger", heading: "Ooops not implemented!", content: "If this bothers you, send patches" }]);
        axios.post("/api/rest/v1/preferences/", preferences, {headers: {Authorization: authToken}}).then(async res => {
            if(res.status === 200){
                setAlerts([...alerts, {id: Date.now(), variant: "success", heading: "Successfully saved preferences"}])
                const expiryDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
                Cookies.set('darkMode', preferences["darkmode"], {expires: expiryDate});
            }
        }).catch((error) => {
            setAlerts([...alerts, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
        })
    };

    const handleReset = () => {
        setAlerts([...alerts, { id: Date.now(), variant: "danger", heading: "Ooops not implemented!", content: "If this bothers you, send patches" }]);
    };

    const fetchCurrentValues = () => {
        axios.get("/api/rest/v1/preferences/", {headers: {Authorization: authToken}}).then(async res => {
            if(res.status === 200){
                setAlerts([...alerts, {id: Date.now(), variant: "success", heading: "Successfully fetched preferences"}])
                //sort preferences by key alphabetically
                let sortedPreferences = {   }
                Object.keys(res.data).sort().forEach(key => {
                    sortedPreferences[key] = res.data[key]
                })
                setPreferences(sortedPreferences);
            }
        }).catch((error) => {
            setAlerts([...alerts, {id: Date.now(), variant: "danger", heading: error.status, content: error.message}])
        })
    }

    useEffect(() => {
        fetchCurrentValues()
    }, []);


    const handleSwitchClick = (key) => {
        setPreferences({...preferences, [key]: preferences[key] === "false" ? "true" : "false"})
        if(key === "darkmode"){
            toggleTheme()
        }
    }

    const handleTextChange = (key, value) => {
        setPreferences({...preferences, [key]: value})
        console.log(value)
    }

    return (
        <>
            <LogoBanner />
            <Col md={"8"} className={"mx-auto"}>
                <Form className={"mb-3"}>
                    {Object.entries(preferences).map(([key, value]) => {
                        if (value === "true" || value === "false") {
                            return <SwitchFormEntry key={key} name={key} currentState={value} id={key} clickHandler={handleSwitchClick} />;
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
                    <Button className={"w-100"} type={"submit"} onClick={() => handleSave()} >Save</Button>
                </Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} type={"submit"} onClick={() => handleReset()}>Reset to Defaults</Button>
                </Col>
                <Col className={"mx-auto"}>
                    <Button className={"w-100"} type={"submit"} onClick={() => {window.location = "/admin"}}>Back</Button>
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