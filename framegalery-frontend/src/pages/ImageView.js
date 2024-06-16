import {useParams} from "react-router-dom";

const ImageView = () => {
    let { id } = useParams()

    return(
        <div>
            <h3>Image View: {id}</h3>
        </div>
    )
}

export default ImageView