import {Button, Modal} from "react-bootstrap";
import React, {useState} from "react";

const GenericModal = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSave = () => {
        handleClose()
        props.saveHandler()
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow} className={"w-100"}>
                {props.showButtonText}
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.titleText}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.children}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {props.saveButtonText}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default GenericModal