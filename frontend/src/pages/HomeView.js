import ImageGrid from "../components/images/ImageGrid";
import LogoBanner from "../components/static/LogoBanner";
import ImageDetailsModal from "../components/images/ImageDetailsModal";
import {useState} from "react";
import {trackEvent} from "../tracking";

const HomeView = () => {
    const [imageIds, setImageIds] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    const imageClickHandler = (event) => {
        const imageId = event.currentTarget.id || event.target.id;
        trackEvent("Gallery", "open image", imageId);
        setSelectedId(imageId)
    }


    return(
        <>
            <LogoBanner />
            <ImageGrid
                api={"/api/rest/v1/image/all?showAll=false"}
                clickHandler={imageClickHandler}
                onImageIdsChange={setImageIds}
            />
            <ImageDetailsModal
                imageIds={imageIds}
                selectedId={selectedId}
                onClose={() => setSelectedId(null)}
                onSelect={setSelectedId}
            />
        </>
    )
}

export default HomeView