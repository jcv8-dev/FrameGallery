import {Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import ImageProperty from "./ImageProperty";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const ImagePropertiesRow = (props) => {

    const [imageProperties, setImageProperties] = useState([])
    const authHeader = useAuthHeader()


    const getImageInfo = () => {
        axios.get(`/api/rest/v1/image/${props.id.split(".")[0]}`, {headers: authHeader})
            .then(res => {
                setImageProperties(res.data.imagePropertyList)
                console.debug(res.data.imagePropertyList)
            })
            .catch(err => {
                console.error(err)
            })
    }

    useEffect(() => {
        if(props.properties !== undefined){
            setImageProperties(props.properties)
            console.debug(props.properties)
        }
        if (props.id !== undefined) {
            getImageInfo()
        }
        console.debug("ImagePropertiesRow Rendered")

    }, []);

    if(imageProperties.length > 0){
        console.warn(imageProperties)
        return(
            <>
                <Row className={"pb-2"}>
                    {imageProperties.map(
                        (property) => (
                            <ImageProperty
                                name={property.name_}
                                value={property.formattedValue_}
                            />)
                    )}
                </Row>
            </>
        )
    }

}

export default ImagePropertiesRow