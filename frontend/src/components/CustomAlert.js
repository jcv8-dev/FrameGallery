import {Alert} from "react-bootstrap";

const CustomAlert = (props) => {

    if(props.children !== ""){
        return(
            <Alert id={"alert"} className={"my-3"} variant={props.variant} dismissible={true}>{props.children}</Alert>
        )
    } else {
        return (<></>)
    }
}

export default CustomAlert