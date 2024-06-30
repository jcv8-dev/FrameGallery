import {Col, Row} from "react-bootstrap";
import axios from "axios";
import {useEffect, useState} from "react";

const LogoBanner = () => {

    const [artistInfo, setArtistInfo] = useState({})

    const fetchArtistInfo = async () => {
        await axios.get("/api/rest/v1/artist/info").then(res => {
            setArtistInfo(res.data);
        }).catch(err => {
            console.error(err)
        })
    }

     useEffect( () => {
        fetchArtistInfo()
        console.debug("Rendered Banner")
    }, []);

    return(
        <>
            <Row className={"pt-3 pb-2"}>
                <Col><h3 className={"mx-auto"} style={{width: "fit-content"}}>Logo</h3></Col>
            </Row>
            <Row className={"pt-2 pb-3"}>
                <Col><h1 className={"mx-auto"} style={{width: "fit-content"}}>{artistInfo.name}</h1></Col>
            </Row>
        </>
    )
}

export default LogoBanner