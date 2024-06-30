import {useEffect, useState} from "react";
import axios from "axios";

const FullScreenImage = (props) => {

    let cursor = props.cursor || "default"

    const [filename, setFilename] = useState("")

    const getFileName = () => {
        axios.get(`/api/rest/v1/image/${props.id}`)
            .then(res => {
                setFilename(res.data.filename)
            }).catch(err => {
                console.error(err)
        })
    }

    useEffect(() => {
        getFileName()
    }, []);

    return (
        <>
            <div className={"bg-light-subtle p-2 mx-auto m-1 shadow-sm"} style={{width: "auto", height: "auto"}}>
                <img id={props.id} style={{cursor: cursor, maxHeight: "75vh", maxWidth: "85vw"}} className={""} src={`/api/rest/v1/image/${filename}`} alt={""} onClick={props.clickHandler}/>
            </div>
        </>
    )
}

export default FullScreenImage