import {useTranslations} from 'next-intl';
import { PopupMessage, PopupMessageType } from "../../old/PopupMessage/PopupMessage";
import { Button } from "../button";
import { DownloadCloud } from 'lucide-react';

export default function BulkDownloadButton() {
    const t = useTranslations()
    const bulkDownload = async () => {
        let content = localStorage?.getItem('selectedContent')
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
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Buttons.BulkDownload.no_selection')))
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Buttons.BulkDownload.no_selection')))
        }
    }

    return (
        <Button variant="bulk_download" onClick={bulkDownload}>
            <DownloadCloud className="w-4 h-4" />
            {t('Buttons.BulkDownload.text')}
        </Button>
    )
}