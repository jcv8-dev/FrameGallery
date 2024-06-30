import {Row} from "react-bootstrap";

const Footer = () => {
    return (
        <>
         <Row className={"mx-auto pt-4"}>
             <p className={"text-center pb-2 pt-3 mb-0 fs-5"}>
                 FrameGallery by Caspar von Beöczy ©2024
             </p>
             <p className={"fst-italic text-center fs-6"}>Avaliable to selfhost soon &trade;</p>
         </Row>
        </>
    )
}

export default Footer