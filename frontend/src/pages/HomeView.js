import ImageGrid from "../components/images/ImageGrid";
import LogoBanner from "../components/static/LogoBanner";

const HomeView = () => {

    const imageClickHandler = (event) => {
        let path = event.target.id
        let filename = path.split("/")
        let id = filename[filename.length-1]
        window.location = `/image/${id}/`
    }


    return(
        <>
            <LogoBanner />
            <ImageGrid api={"/api/rest/v1/image/all?showAll=false"} clickHandler={imageClickHandler}/>
        </>
    )
}

export default HomeView