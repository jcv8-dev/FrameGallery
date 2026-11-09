import {ProgressBar} from "react-bootstrap";
import {useState} from "react";

const ImageGridImage = (props) => {
    const cursor = props.cursor || "default";
    const [imageLoaded, setImageLoaded] = useState(false);
    const showTranscodingStatus = props.showTranscodingStatus === true;
    const isReady = !showTranscodingStatus || props.transcodingStatus === "COMPLETE";
    const isFailed = props.transcodingStatus === "FAILED";
    const progress = props.transcodingStatus === "PROCESSING" ? 65 : 25;

    return (
        <div className={`${props.accentBorder ? "bg-light-subtle p-2 shadow-sm" : ""} m-1 fg-image-frame ${imageLoaded ? "fg-image-loaded" : ""}`} style={{position: "relative"}}>
            {props.selectable ? (
                <input
                    type="checkbox"
                    aria-label={`Select image ${props.id}`}
                    checked={props.selected}
                    onChange={() => props.onSelectionChange(props.id)}
                    onClick={(event) => event.stopPropagation()}
                    style={{position: "absolute", top: "0.75rem", left: "0.75rem", zIndex: 2}}
                />
            ) : null}
            {isReady && props.highlightUnpublished && !props.published ? (
                <div id={props.id} className="fg-unpublished-cover" onClick={props.clickHandler}>
                    Not Published
                </div>
            ) : null}
            {isReady ? (
                <img
                    id={props.id}
                    draggable={false}
                    onContextMenu={(event) => event.preventDefault()}
                    style={{cursor, display: "block", width: "auto", maxWidth: "100%", height: "auto", userSelect: "none"}}
                    className={"img-fluid bg-body-secondary"}
                    src={props.src}
                    alt={""}
                    onClick={props.clickHandler}
                    onLoad={() => setImageLoaded(true)}
                />
            ) : (
                <div
                    className="d-flex flex-column justify-content-center"
                    aria-label={`Image ${props.id} is ${isFailed ? "failed" : "transcoding"}`}
                >
                    <ProgressBar
                        now={progress}
                        animated={!isFailed}
                        variant={isFailed ? "danger" : "info"}
                    />
                    <small className="text-center mt-2">
                        {isFailed ? "Transcoding failed" : "Transcoding image..."}
                    </small>
                </div>
            )}
        </div>
    );
};

export default ImageGridImage;
