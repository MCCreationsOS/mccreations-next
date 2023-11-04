import Link from "next/link";
import { Archive, Box, Compass } from "react-feather";

export default function FileCard({file}) {

    return (
        <div className="fileCard">
            <div className="fileDownloadOptions">
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <Link title="Download Complete World" className="fileButton" href={file.worldUrl}><Archive /></Link> : <></>}
                {(file.resourceUrl) ? <Link title="Download Resourcepack" className="fileButton" href={file.resourceUrl}><Compass /></Link> : <></>}
                {(file.dataUrl) ? <Link title="Download Datapack" className="fileButton" href={file.dataUrl}><Box /></Link> : <></>}
            </div>
        </div>
    )
}