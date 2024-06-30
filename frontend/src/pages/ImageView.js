import {useParams} from "react-router-dom";
import LogoBanner from "../components/static/LogoBanner";
import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import ImageInfoBanner from "../components/images/ImageInfoBanner";
import FullScreenImage from "../components/images/FullScreenImage";

const ImageView = () => {
    let { id } = useParams()

    return(
        <>
            <LogoBanner />
            <Row className={"pb-3"}>
                <FullScreenImage id={id} />
            </Row>
            <Row className={"pb-3"}>
                <ImageInfoBanner id={id} />
            </Row>
            <Row>
                <Col xs={4} sm={3} md={2} className={"mx-auto"}>
                    <Button variant={"primary"} className={"w-100"} onClick={() => {window.location = "/"}}>Go back</Button>
                </Col>
            </Row>
        </>
    )
}

export default ImageView