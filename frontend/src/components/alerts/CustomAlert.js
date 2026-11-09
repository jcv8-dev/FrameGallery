import {Alert} from "react-bootstrap";

const CustomAlert = (props) => {

    if(props.children){
        return(
            <Alert
                className={"fg-alert my-3"}
                variant={props.variant || "info"}
                dismissible={props.dismissible !== false}
                role={"alert"}
            >
                {props.heading && <Alert.Heading>{props.heading}</Alert.Heading>}
                <div>{props.children}</div>
            </Alert>
        )
    } else {
        return (<></>)
    }
}

export default CustomAlert