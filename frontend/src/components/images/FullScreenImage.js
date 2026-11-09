import {apiUrl} from "../../api";

const FullScreenImage = (props) => {

    let cursor = props.cursor || "default"

    return (
        <>
            <div className={`${props.frame === false ? "" : "bg-light-subtle p-2 mx-auto m-1 shadow-sm"} ${props.className || ""}`} style={{width: "auto", height: "auto"}}>
                <img
                    id={props.id}
                    draggable={false}
                    onContextMenu={(event) => event.preventDefault()}
                    style={{cursor: cursor, maxHeight: "75vh", maxWidth: "85vw", userSelect: "none"}}
                    className={""}
                    src={apiUrl(`/api/rest/v1/image/${props.id}/resolution/1920`)}
                    alt={""}
                    onClick={props.clickHandler}
                />
            </div>
        </>
    )
}

export default FullScreenImage