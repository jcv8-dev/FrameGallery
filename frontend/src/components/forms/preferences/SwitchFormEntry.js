import {Form} from "react-bootstrap";

const SwitchFormEntry = (props) => {

    const switchAction = () => {
        props.clickHandler(props.id)
    }

    if(props.currentState === "false") {
        return (
            <>
                <Form.Switch
                    className={"mb-2"}
                    onChange={switchAction}
                    type="switch"
                    id={props.id}
                    label={props.id}
                />
            </>
        )
    } else {
        return (
            <>
                <Form.Switch
                    className={"mb-2"}
                    onChange={switchAction}
                    checked
                    type="switch"
                    id={props.id}
                    label={props.id}
                />
            </>
        )
    }
}

export default SwitchFormEntry