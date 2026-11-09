import axios from "axios";
import {useEffect, useRef, useState} from "react";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import ImageGridImage from "./ImageGridImage";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import {apiUrl} from "../../api";

const ImageGrid = (props) => {

    const authHeader = useAuthHeader();
    const {api, trigger, onImageIdsChange} = props;
    const [imagePaths, setImagePaths] = useState([]);
    const [transcodingStates, setTranscodingStates] = useState({});
    const [accentBorder, setAccentBorder] = useState(true);
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
    const stateRef = useRef({});
    const completionHandlerRef = useRef(props.onTranscodingComplete);

    completionHandlerRef.current = props.onTranscodingComplete;

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        axios.get(api, {headers: {Authorization: authHeader}})
            .then(res => {
                setImagePaths(res.data);
                onImageIdsChange?.([...new Set(res.data.map(image => image.split(".")[0]))]);
            })
            .catch(err => console.error(err))
        console.debug("Rendered ImageGrid")
    }, [api, trigger, authHeader, onImageIdsChange]);

    useEffect(() => {
        axios.get("/api/rest/v1/preferences/accent-border")
            .then(response => setAccentBorder(response.data === true || response.data === "true"))
            .catch(error => console.error(error));
    }, [props.trigger]);

    const imageIds = imagePaths.map(image => image.split(".")[0]);
    const allImageIds = [...new Set([
        ...imageIds,
        ...(props.optimisticIds || [])
    ])];
    const imageIdKey = allImageIds.join(",");

    useEffect(() => {
        if (!props.showTranscodingStatus) {
            return undefined;
        }

        const optimisticStates = Object.fromEntries(
            (props.optimisticIds || []).map(id => [id, {status: "QUEUED", published: false}])
        );
        stateRef.current = {...optimisticStates, ...stateRef.current};
        setTranscodingStates(current => ({...optimisticStates, ...current}));
    }, [props.optimisticIds, props.showTranscodingStatus]);

    useEffect(() => {
        if (!props.showTranscodingStatus) {
            return undefined;
        }

        const publishedUpdates = Object.fromEntries(
            (props.publishedIds || []).map(id => [
                id,
                {...(stateRef.current[id] || {}), published: true}
            ])
        );
        stateRef.current = {...stateRef.current, ...publishedUpdates};
        setTranscodingStates(current => ({...current, ...publishedUpdates}));
    }, [props.publishedIds, props.showTranscodingStatus]);

    useEffect(() => {
        if (!props.showTranscodingStatus) {
            return undefined;
        }

        let cancelled = false;
        let timeoutId;
        let delay = 1000;

        const poll = async () => {
            const idsToCheck = (imageIdKey ? imageIdKey.split(",") : []).filter(id => {
                const status = stateRef.current[id]?.status;
                return status !== "COMPLETE" && status !== "FAILED";
            });

            if (idsToCheck.length === 0 || cancelled) {
                return;
            }

            try {
                const response = await axios.get("/api/rest/v1/image/transcoding", {
                    params: {ids: idsToCheck.join(",")},
                    headers: {Authorization: authHeader}
                });
                if (cancelled) return;

                const updates = Object.fromEntries(response.data.map(image => [
                    image.id,
                    {status: image.status, published: image.published}
                ]));
                stateRef.current = {...stateRef.current, ...updates};
                setTranscodingStates(current => ({...current, ...updates}));

                response.data
                    .filter(image => image.status === "COMPLETE" || image.status === "FAILED")
                    .forEach(image => {
                        if (image.status === "COMPLETE") {
                            completionHandlerRef.current?.(image.id);
                        }
                    });

                const hasPending = idsToCheck.some(id => {
                    const status = updates[id]?.status || stateRef.current[id]?.status;
                    return status !== "COMPLETE" && status !== "FAILED";
                });
                if (hasPending && !cancelled) {
                    timeoutId = setTimeout(poll, delay);
                    delay = Math.min(delay * 2, 5000);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error(error);
                    timeoutId = setTimeout(poll, delay);
                    delay = Math.min(delay * 2, 5000);
                }
            }
        };

        poll();
        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [imageIdKey, authHeader, props.showTranscodingStatus]);
    const allSelected = allImageIds.length > 0 && allImageIds.every(id => props.selectedIds?.includes(id));

    const toggleSelectAll = () => {
        props.onSelectionChange(allSelected ? [] : allImageIds);
    };

    const toggleSelection = (id) => {
        const selectedIds = props.selectedIds || [];
        props.onSelectionChange(
            selectedIds.includes(id)
                ? selectedIds.filter(selectedId => selectedId !== id)
                : [...selectedIds, id]
        );
    };

    const columnsCount = viewportWidth < 550
        ? 1
        : viewportWidth < 900
            ? 2
            : viewportWidth < 1100
                ? 3
                : 4;

    return(
        <>
            {props.selectable ? (
                <div className={"position-relative mb-2"}>
                    <input
                        type="checkbox"
                        aria-label="Select all images"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                    />
                    <span className={"ms-2"}>Select all</span>
                </div>
            ) : (<></>)}
            <div className="fg-image-grid">
                <ResponsiveMasonry columnsCountBreakPoints={{0: columnsCount}}>
                    <Masonry>
                        {allImageIds.map((id) => (
                            <ImageGridImage
                                key={id}
                                cursor={"pointer"}
                                clickHandler={props.clickHandler}
                                highlightUnpublished={props.highlightUnpublished}
                                src={apiUrl(`/api/rest/v1/image/${id}/resolution/640`)}
                                id={id}
                                selectable={props.selectable}
                                selected={props.selectedIds?.includes(id)}
                                onSelectionChange={toggleSelection}
                                transcodingStatus={transcodingStates[id]?.status}
                                published={transcodingStates[id]?.published}
                                showTranscodingStatus={props.showTranscodingStatus}
                                accentBorder={accentBorder}
                            />
                        ))}
                    </Masonry>
                </ResponsiveMasonry>
            </div>
        </>
    )
}

export default ImageGrid