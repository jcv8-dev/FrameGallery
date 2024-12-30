import {Form, InputGroup} from "react-bootstrap";

const TextAreaFormEntry = (props) => {


    return (
        <>
            <InputGroup className={"mb-2"}>
                <InputGroup.Text>{props.name}</InputGroup.Text>
                <Form.Control as={"textarea"} rows={props.height} placeholder={props.placeholder} defaultValue={props.value} />
            </InputGroup>
        </>
    )
}

export default TextAreaFormEntry