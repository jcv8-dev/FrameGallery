import {Col, InputGroup} from "react-bootstrap";

const ImageProperty = (props) => {

    if(props.name !== "" && props.name !== undefined && props.value !== "" && props.value !== undefined ){
        return(
            <>
                <Col xs={"auto"} className={"pb-2 px-1"}>
                    <InputGroup>
                        <InputGroup.Text>{props.name}</InputGroup.Text>
                        <InputGroup.Text>{props.value}</InputGroup.Text>
                    </InputGroup>
                </Col>

            </>
        )
    } else return (<></>)

}

export default ImageProperty