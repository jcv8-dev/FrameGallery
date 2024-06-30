import axios from "axios";
import {useEffect, useState} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import ImageGridImage from "./ImageGridImage";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"

const ImageGrid = (props) => {

    const authHeader = useAuthHeader();
    const [imagePaths, setImagePaths] = useState([]);

    let fetchImages = () => {
        axios.get(props.api, {headers: {Authorization: authHeader}})
            .then(res => {
            setImagePaths(res.data)
        }).catch(err => {
            console.error(err)
        })
    }

    useEffect(() => {
        fetchImages()
        console.debug("Rendered ImageGrid")
    }, [props.trigger]);


    return(
        <>
            <ResponsiveMasonry columnsCountBreakPoints={{350: 1, 750: 2, 900: 3, 1100: 4}}>
                <Masonry>
                    {imagePaths.map((image) => (
                        <ImageGridImage  cursor={"pointer"} clickHandler={props.clickHandler} highlightUnpublished={props.highlightUnpublished} src={`/api/rest/v1/image/${image}`} id={image.split(".")[0]}/>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </>
    )
}

export default ImageGrid