import {Alert} from "react-bootstrap";
import {useEffect, useState} from "react";

const TimedAlert = (props) => {

    const [visible, setVisible] = useState()

    function onShowAlert(){
        setVisible(true)
        setTimeout(() => {
            setVisible(false)
        }, props._timeout || 5000)
    }

    useEffect(() => {
        onShowAlert()
    }, []);

    return(
        <Alert id={props.id} show={visible} className={"my-3 mx-auto"} variant={props.variant} dismissible={props.dismissible} style={{maxWidth: "50vw", width: "auto"}} onClose={()=>{setVisible(false)}}>
            <Alert.Heading>{props.heading}</Alert.Heading>
            {props.content}
        </Alert>
    )
}

export default TimedAlert