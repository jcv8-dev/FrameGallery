import {Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import ImageProperty from "./ImageProperty";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

const ImagePropertiesRow = (props) => {

    const [imageProperties, setImageProperties] = useState([])
    const authHeader = useAuthHeader()


    useEffect(() => {
        if(props.properties !== undefined){
            setImageProperties(props.properties)
            console.debug(props.properties)
        }
        if (props.id !== undefined) {
            axios.get(`/api/rest/v1/image/${props.id.split(".")[0]}`, {headers: {Authorization: authHeader}})
                .then(res => setImageProperties(res.data.imagePropertyList))
                .catch(err => console.error(err))
        }
        console.debug("ImagePropertiesRow Rendered")

    }, [props.id, props.properties, authHeader]);

    if(imageProperties.length > 0){
        console.warn(imageProperties)
        return(
            <>
                <Row className={"pb-2"}>
                    {imageProperties.map(
                        (property) => (
                            <ImageProperty
                                key={`${property.name_}-${property.formattedValue_}`}
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