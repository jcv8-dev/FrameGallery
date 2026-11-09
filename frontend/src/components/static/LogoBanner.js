import {Col, Row} from "react-bootstrap";
import axios from "axios";
import {useEffect, useState} from "react";
import {apiUrl} from "../../api";

const LogoBanner = () => {

    const [artistInfo, setArtistInfo] = useState({})
    const [showArtistName, setShowArtistName] = useState(true)
    const logoUrl = `${apiUrl("/api/rest/v1/branding/logo")}?v=${Date.now()}`

    const fetchArtistInfo = async () => {
        await Promise.all([
            axios.get("/api/rest/v1/artist/info"),
            axios.get("/api/rest/v1/preferences/")
        ]).then(([artistResponse, preferencesResponse]) => {
            setArtistInfo(artistResponse.data);
            setShowArtistName(preferencesResponse.data["show-artist-name"] !== "false");
        }).catch(err => {
            if(err.response?.status === 404){
                console.error("Artist not found, not yet onboarded")
            } else {
                console.error(err)
            }
        })
    }

     useEffect( () => {
        fetchArtistInfo()
        console.debug("Rendered Banner")
    }, []);

    return(
        <>
            <Row className={"pt-3 pb-2"}>
                <Col className={"text-center"}>
                    <a href={"/"} aria-label={"Go to home"}>
                        <img
                            className={"fg-logo"}
                            src={logoUrl}
                            alt={"Site logo"}
                            onError={(event) => { event.currentTarget.style.display = "none"; }}
                        />
                    </a>
                </Col>
            </Row>
            {showArtistName && (
                <Row className={"pt-2 pb-3"}>
                    <Col><h1 className={"mx-auto"} style={{width: "fit-content"}}>{artistInfo.name}</h1></Col>
                </Row>
            )}
        </>
    )
}

export default LogoBanner