import {Form, InputGroup} from "react-bootstrap";
import {useState} from "react";

const TextAreaFormEntry = (props) => {

    const [value, setValue] = useState(props.value);

    const handleChange = (event) => {
        setValue(event.target.value);
        props.changeHandler(props.name, event.target.value);
    };

    return (
        <>
            <InputGroup className={"mb-2"}>
                <InputGroup.Text>{props.name}</InputGroup.Text>
                <Form.Control
                    as={"textarea"}
                    rows={props.height}
                    placeholder={props.placeholder}
                    value={value}
                    onChange={handleChange}
                />
            </InputGroup>
        </>
    );
};

export default TextAreaFormEntry