import Link from "next/link";
import { Archive, Box, Compass } from "react-feather";

export default function FileCard({file}: {file: any}) {

    return (
        <div className="file_card">
            <div className="download_options">
                <p>{(file.contentVersion) ? file.contentVersion : "1.0"}</p>
                {(file.worldUrl) ? <Link title="Download Complete World" className="file_button" href={file.worldUrl}><Archive /></Link> : <></>}
                {(file.resourceUrl) ? <Link title="Download Resourcepack" className="file_button" href={file.resourceUrl}><Compass /></Link> : <></>}
                {(file.dataUrl) ? <Link title="Download Datapack" className="file_button" href={file.dataUrl}><Box /></Link> : <></>}
            </div>
        </div>
    )
}