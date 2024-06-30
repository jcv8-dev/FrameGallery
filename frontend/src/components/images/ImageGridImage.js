import {useEffect, useState} from "react";
import axios from "axios";

const ImageGridImage = (props) => {

    let cursor = props.cursor || "default"

    const [published, setPublished] = useState(false)

    useEffect(() => {
        getImageInfo()
    }, []);

    const getImageInfo = () => {
        axios.get(`/api/rest/v1/image/${props.id}`).then(res => {
            setPublished(res.data.published)
        }).catch(err => {
            console.error(err)
        })
    }

    return (
        <div className={"bg-light-subtle p-2 m-1 shadow-sm"} style={{ position: 'relative' }}>
            {props.highlightUnpublished && !published ? (
                <div id={props.id} className="fg-unpublished-cover" onClick={props.clickHandler}>
                    Not Published
                </div>
            ) : (<></>)}
            <img id={props.id} style={{cursor: cursor}} className={"img-fluid"} src={props.src} alt={""} onClick={props.clickHandler}/>
        </div>
    );
}

export default ImageGridImage