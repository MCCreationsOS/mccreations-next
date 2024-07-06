import { DownloadCloud } from "react-feather";
import IconButton from "./IconButton";

export default function BulkDownloadButton() {
    const bulkDownload = async () => {
        let content = localStorage.getItem('selectedContent')
        if(content) {
            let selected = JSON.parse(content)
            selected.forEach((url: string) => {
                console.log(url)
                let a = document.createElement('a')
                a.href = url
                a.download = url.split('/').pop()!
                a.target = '_blank'
                a.click()
                a.remove()
            })
        }
    }

    return (
        <IconButton className="secondary" onClick={bulkDownload}><svg viewBox="0 0 45 45"><text x="3" y="15" fontSize={15} fill="white">BULK</text><DownloadCloud x="10" y="20"/></svg></IconButton>
    )
}