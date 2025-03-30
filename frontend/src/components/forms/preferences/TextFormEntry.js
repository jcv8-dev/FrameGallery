import {Form, InputGroup} from "react-bootstrap";
import {useState} from "react";

const TextFormEntry = (props) => {

    const [value, setValue] = useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
        props.changeHandler(props.name, event.target.value);
    };


    return (
        <InputGroup className={"mb-2"}>
            <InputGroup.Text>{props.name}</InputGroup.Text>
            <Form.Control type={"text"}
                          placeholder={props.placeholder}
                          value={value}
                          onChange={handleChange} />
        </InputGroup>
    )

}


export default TextFormEntry