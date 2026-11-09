import {useParams, useNavigate} from "react-router-dom";
import LogoBanner from "../components/static/LogoBanner";
import {useEffect, useState} from "react";
import axios from "axios";
import ImageDetailsModal from "../components/images/ImageDetailsModal";

const ImageView = () => {
    let { id } = useParams()
    const navigate = useNavigate()
    const [imageIds, setImageIds] = useState([id])

    useEffect(() => {
        axios.get("/api/rest/v1/image/all?showAll=false")
            .then(res => setImageIds([...new Set(res.data.map(image => image.split(".")[0]))]))
            .catch(error => console.error(error))
    }, [])

    return(
        <>
            <LogoBanner />
            <ImageDetailsModal
                imageIds={imageIds}
                selectedId={id}
                onClose={() => navigate("/")}
                onSelect={(nextId) => navigate(`/image/${nextId}`)}
            />
        </>
    )
}

export default ImageView