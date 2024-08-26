import { Download, DownloadCloud } from "react-feather";
import IconButton from "./IconButton";
import { useI18n } from "@/locales/client";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";

export default function BulkDownloadButton() {
    const t = useI18n();
    const bulkDownload = async () => {
        let content = localStorage.getItem('selectedContent')
        if(content) {
            let selected = JSON.parse(content)
            selected.forEach((url: string) => {
                let a = document.createElement('a')
                a.href = url
                a.download = url.split('/').pop()!
                a.target = '_blank'
                a.click()
                a.remove()
            })
            if(selected.length === 0) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('button.bulk_download.no_selection')))
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('button.bulk_download.no_selection')))
        }
    }

    return (
        <IconButton className="secondary" onClick={bulkDownload}><svg viewBox="0 0 45 45"><text x="3" y="15" fontSize={15} fill="white">{t('button.bulk_download')}</text><Download x="10" y="20"/></svg></IconButton>
    )
}