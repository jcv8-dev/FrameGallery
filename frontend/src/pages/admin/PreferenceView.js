import LogoBanner from "../../components/static/LogoBanner";
import {Button, Col, Container, Form, InputGroup, Row} from "react-bootstrap";
import TimedAlert from "../../components/alerts/TimedAlert";
import {useState} from "react";

const PreferenceView = () => {
    const toggleTheme = () => {
        console.log("Toggle Darkmode")
        let theme = getTheme() === "dark" ? "light" : "dark"
        document.documentElement.setAttribute("data-bs-theme", theme)
    }

    const getTheme = () => {
        return document.documentElement.getAttribute("data-bs-theme")
    }

    const [showAlert, setShowAlert] = useState(false);

    const [alerts, setAlerts] = useState([])

    const handleSave = () => {
        setAlerts([...alerts, { id: Date.now(), variant: "danger", heading: "Ooops not implemented!", content: "If this bothers you, send patches" }]);
    };

    return (
        <>
            <LogoBanner />
            <Col sm={"6"} className={"mx-auto"}>
                <Form className={"mb-3"}>
                    <Form.Switch
                        onClick={toggleTheme}
                        defaultChecked={getTheme() === "dark"}
                        type="switch"
                        id="darkmode"
                        label="Darkmode"
                    />
                    <Form.Switch
                        type="switch"
                        id="image-accent-border"
                        label="Show Image Accent Border"
                    />
                    <Form.Switch
                        type="switch"
                        id="title-quotes"
                        label="Show Image Title in Quotes"
                    />
                    <InputGroup className={"mb-2"}>
                        <InputGroup.Text>Locale</InputGroup.Text>
                        <Form.Control type={"text"} placeholder={"en_EN"} />
                    </InputGroup>
                    <InputGroup className={"mb-2"}>
                        <InputGroup.Text>Meta Description</InputGroup.Text>
                        <Form.Control type={"text"} placeholder={"FrameGallery"} />
                    </InputGroup>
                    <InputGroup className={"mb-2"}>
                        <InputGroup.Text>Meta Text</InputGroup.Text>
                        <Form.Control type={"text"} placeholder={"The Photographers Content Management System"} />
                    </InputGroup>
                    <InputGroup className={"mb-2"}>
                        <InputGroup.Text>Tracking Code</InputGroup.Text>
                        <Form.Control as={"textarea"} rows={15} placeholder={"// Inner part of your tracking tag (<\script>...<\\script>)\n" +
                            "for example:\n" +
                            "var _paq = window._paq = window._paq || [];\n" +
                            "  _paq.push(['trackPageView']);\n" +
                            "  _paq.push(['enableLinkTracking']);\n" +
                            "  (function() {\n" +
                            "    var u=\"https://analytics.yourdomain.com/\";\n" +
                            "    _paq.push(['setTrackerUrl', u+'matomo.php']);\n" +
                            "    _paq.push(['setSiteId', '2']);\n" +
                            "    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];\n" +
                            "    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);\n" +
                            "  })();\n"} />
                    </InputGroup>
                    <InputGroup className={"mb-2"}>
                        <InputGroup.Text>Favicon</InputGroup.Text>
                        <input type={"file"} id={"file"} name={"file"}/>
                    </InputGroup>
                    <InputGroup className={"mb-2"}>
                        <InputGroup.Text>Logo</InputGroup.Text>
                        <input type={"file"} id={"file"} name={"file"}/>
                    </InputGroup>
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