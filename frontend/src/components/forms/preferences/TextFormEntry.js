import {Form, InputGroup} from "react-bootstrap";

const TextFormEntry = (props) => {


    return (
        <InputGroup className={"mb-2"}>
            <InputGroup.Text>{props.name}</InputGroup.Text>
            <Form.Control type={"text"} placeholder={props.placeholder} defaultValue={props.value} />
        </InputGroup>
    )

}


export default TextFormEntry