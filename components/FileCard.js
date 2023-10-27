import Link from "next/link";
import { Archive, Box, Compass } from "react-feather";

export default function FileCard({file}) {

    return (
        <div className="fileCard">
            <div className="fileDownloadOptions">
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <Link className="fileButton" href={file.worldUrl}><Archive /></Link> : <></>}
                {(file.resourceUrl) ? <Link className="fileButton" href={file.resourceUrl}><Compass /></Link> : <></>}
                {(file.dataUrl) ? <Link className="fileButton" href={file.dataUrl}><Box /></Link> : <></>}
            </div>
        </div>
    )
}