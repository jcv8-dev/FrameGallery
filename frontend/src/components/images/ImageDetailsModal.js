import {Button, Modal} from "react-bootstrap";
import {useCallback, useEffect} from "react";
import ImageInfoBanner from "./ImageInfoBanner";
import FullScreenImage from "./FullScreenImage";
import {trackEvent} from "../../tracking";

const ImageDetailsModal = ({imageIds, selectedId, onClose, onSelect}) => {
    const currentIndex = imageIds.indexOf(selectedId);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex >= 0 && currentIndex < imageIds.length - 1;

    const closeModal = useCallback((method = "button") => {
        trackEvent("Image modal", "close", method);
        onClose();
    }, [onClose]);

    const navigateTo = useCallback((index, direction) => {
        if (index < 0 || index >= imageIds.length) {
            return;
        }
        trackEvent("Image modal", "navigate", direction);
        onSelect(imageIds[index]);
    }, [imageIds, onSelect]);

    useEffect(() => {
        if (!selectedId) {
            return undefined;
        }
        trackEvent("Image modal", "open", selectedId);
    }, [selectedId]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowLeft" && hasPrevious) {
                navigateTo(currentIndex - 1, "previous");
            } else if (event.key === "ArrowRight" && hasNext) {
                navigateTo(currentIndex + 1, "next");
            } else if (event.key === "Escape") {
                closeModal("escape");
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentIndex, hasNext, hasPrevious, imageIds, closeModal, navigateTo]);

    if (!selectedId) {
        return null;
    }

    return (
        <Modal show={true} onHide={onClose} fullscreen={true} dialogClassName={"fg-image-modal"} centered scrollable>
            <Modal.Body className={"fg-image-modal-body"}>
                <Button
                    className={"fg-image-modal-close"}
                    variant={"light"}
                    aria-label={"Close image details"}
                    onClick={() => closeModal()}
                >
                    ×
                </Button>
                <div className={"fg-image-modal-viewer"}>
                    <FullScreenImage id={selectedId} frame={false} className={"fg-image-modal-stage"} />
                </div>
                <ImageInfoBanner id={selectedId} />
                <div className={"fg-image-modal-controls"}>
                    <Button
                        className={"fg-image-modal-nav"}
                        variant={"secondary"}
                        aria-label={"Previous image"}
                        disabled={!hasPrevious}
                        onClick={() => navigateTo(currentIndex - 1, "previous")}
                    >
                        ‹
                    </Button>
                    <Button
                        className={"fg-image-modal-nav"}
                        variant={"secondary"}
                        aria-label={"Next image"}
                        disabled={!hasNext}
                        onClick={() => navigateTo(currentIndex + 1, "next")}
                    >
                        ›
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ImageDetailsModal;
