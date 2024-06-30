import {useEffect, useState} from "react";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import {Col, Row} from "react-bootstrap";
import ImagePropertiesRow from "./info/properties/ImagePropertiesRow";
import HorizontalDivider from "../static/HorizontalDivider";

const ImageInfoBanner = (props) => {
    const [imageInfo, setImageInfo] = useState({})
    const authHeader = useAuthHeader()

    useEffect(() => {
        getImageInfo()
    }, []);

    const getImageInfo = () => {
        axios.get(`/api/rest/v1/image/${props.id.split(".")[0]}`, {headers: authHeader})
            .then(res => {
                setImageInfo(res.data)
            })
            .catch(err => {
                console.error(err)
            })
    }

    return(
        <>
            <Row>
                <Col xs={"auto"} className={"mx-auto"}>
                    <ImagePropertiesRow id={props.id.split(".")[0]} />
                </Col>
            </Row>
            <HorizontalDivider />
            <Row>
                <Col>
                    {imageInfo.title !== null && imageInfo.title !== undefined && imageInfo.title .length > 0 ?  <p className={"text-center fs-3 mb-2"}>"{imageInfo.title}"</p> : <></>}
                    {imageInfo.description !== null && imageInfo.description !== undefined && imageInfo.description.length > 0 ? <p className={"text-center fst-italic fs-5 mb-2"}>{imageInfo.description}</p> : <></>}
                </Col>
            </Row>
        </>
    )
}

export default ImageInfoBanner