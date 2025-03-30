import {useParams} from "react-router-dom";
import LogoBanner from "../../components/static/LogoBanner";
import {Button, Col, Row} from "react-bootstrap";
import ImageGridImage from "../../components/images/ImageGridImage";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {useEffect, useState} from "react";
import ImageEditor from "../../components/administration/ImageEditor";
import FullScreenImage from "../../components/images/FullScreenImage";
import ImagePropertiesRow from "../../components/images/info/properties/ImagePropertiesRow";
import HorizontalDivider from "../../components/static/HorizontalDivider";

const ImageEditView = (props) => {
    const authToken = useAuthHeader();
    const [imageTrigger, setImageTrigger] = useState(0)

    const setImageInfo = (event, newImageInfo) => {
        event.preventDefault()
        axios.put(`/api/rest/v1/image/${props.id}`, newImageInfo, {headers: {Authorization: authToken}})
            .then(res => {
                setImageTrigger(prevImageTrigger => prevImageTrigger + 1 )
            })
            .catch(err => {console.error(err)})
    }

    return(
        <>
            <LogoBanner />
            <Row className={"pb-3"}>
                <Col xs={4} sm={3} md={2} className={"mx-auto"}>
                    <Button variant={"primary"} className={"w-100"} onClick={() => {window.location = "/admin"}}>Go back</Button>
                </Col>
            </Row>
            <Row className={"pb-3"} style={{}}>
                <FullScreenImage id={props.id} cursor={""} />
            </Row>
            <Row>
                <Col xs={"auto"} className={"mx-auto"}>
                    <ImagePropertiesRow id={props.id}/>
                </Col>
            </Row>
            <Row className={"fg-w-limit-xl mx-auto"}>
                <HorizontalDivider />
            </Row>
            <Row className={"pb-3 fg-w-limit-xl mx-auto"}>
                <ImageEditor trigger={imageTrigger} submitHandler={setImageInfo} id={props.id}/>
            </Row>

        </>
    )
}

export default ImageEditView