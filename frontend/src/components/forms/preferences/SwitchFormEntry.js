import {Form} from "react-bootstrap";

const SwitchFormEntry = (props) => {


    return (
        <>
            <Form.Switch
                className={"mb-2"}
                onClick={props.clickHandler()}
                defaultChecked={props.currentState}
                type="switch"
                id={props.id}
                label={props.id}
            />
        </>
    )
}

export default SwitchFormEntry