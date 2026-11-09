import {Alert} from "react-bootstrap";
import {useEffect, useState} from "react";

const TimedAlert = (props) => {

    const [visible, setVisible] = useState()

    useEffect(() => {
        setVisible(true)
        const timeout = setTimeout(() => {
            setVisible(false)
        }, props._timeout || 5000)
        return () => clearTimeout(timeout)
    }, [props._timeout]);

    return(
        <Alert
            id={props.id}
            show={visible}
            className={"fg-alert my-3 mx-auto"}
            variant={props.variant || "info"}
            dismissible={props.dismissible}
            role={"alert"}
            onClose={()=>{setVisible(false)}}
        >
            {props.heading && <Alert.Heading>{props.heading}</Alert.Heading>}
            <div>{props.content}</div>
        </Alert>
    )
}

export default TimedAlert