import {Button, Row} from "react-bootstrap";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const Footer = () => {
    const isAuthenticated = useIsAuthenticated();

    return (
        <>
         <Row className={"mx-auto pt-4"}>
             <p className={"text-center pb-2 pt-3 mb-0 fs-5"}>
                 FrameGallery by Caspar von Beöczy ©2024
             </p>
             <p className={"fst-italic text-center fs-6"}>Avaliable to selfhost soon &trade;</p>
             <div className={"text-center pb-3"}>
                 <Button
                     as={"a"}
                     href={isAuthenticated ? "/admin" : "/admin/login"}
                     variant={"outline-secondary"}
                 >
                     {isAuthenticated ? "Admin" : "Log In"}
                 </Button>
             </div>
         </Row>
        </>
    )
}

export default Footer