import LogoBanner from "../../components/static/LogoBanner";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import TimedAlert from "../../components/alerts/TimedAlert";
import {useEffect, useState} from "react";
import axios from "axios";
import SwitchFormEntry from "../../components/forms/preferences/SwitchFormEntry";
import TextAreaFormEntry from "../../components/forms/preferences/TextAreaFormEntry";
import TextFormEntry from "../../components/forms/preferences/TextFormEntry";
import {map} from "react-bootstrap/ElementChildren";

const PreferenceView = () => {
    const toggleTheme = () => {
        console.log("Toggle Darkmode")
        let theme = getTheme() === "dark" ? "light" : "dark"
        document.documentElement.setAttribute("data-bs-theme", theme)
    }

    const getTheme = () => {
        return document.documentElement.getAttribute("data-bs-theme")
    }

    const [alerts, setAlerts] = useState([])

    const [preferences, setPreferences] = useState([])

    const handleSave = () => {
        setAlerts([...alerts, { id: Date.now(), variant: "danger", heading: "Ooops not implemented!", content: "If this bothers you, send patches" }]);
    };

    const fetchCurrentValues = () => {
        axios.get("/api/rest/v1/preferences/fetch").then(async res => {
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
            setAlerts([...alerts, {id: Date.now(), variant: "danger", heading: "Unable to fetch preferences", content: error.content}])
        })
    }

    useEffect(() => {
        fetchCurrentValues()
    }, []);

    const handleSwitchClick = (key, newValue) => {
        console.log(key +"has new value "+ newValue)
    }

    return (
        <>
            <LogoBanner />
            <Col sm={"6"} className={"mx-auto"}>
                <Form className={"mb-3"}>
                    {Object.entries(preferences).map(([key, value]) => {
                        if (value === "true" || value === "false") {
                            return <SwitchFormEntry key={key} name={key} defaultChecked={value === "true"} id={key} clickHandler={handleSwitchClick} />;
                        } else if (value.length < 20) {
                            return <TextFormEntry key={key} name={key} placeholder={value} value={value} />
                        } else {
                            return <TextAreaFormEntry key={key} name={key} placeholder={value} value={value} height={5}/>
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