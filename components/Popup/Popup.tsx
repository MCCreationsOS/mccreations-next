'use client'

import { ReactElement, useState } from "react"
import { X } from "react-feather"

export class Popup {
    static title: string
    static canClose: boolean
    static onClose: () => void
    static onCreate: () => void
    static content: ReactElement

    static createPopup(content: ReactElement, title?: string, canClose?: boolean) {
        Popup.content = content;

        if(title) {
            Popup.title = title;
        } else {
            Popup.title = ""
        }

        if(canClose) {
            Popup.canClose = canClose
        } else {
            Popup.canClose = true;
        }

        Popup.onCreate();
    }
}

export default function PopupComponent() {
    const [isOpen, setIsOpen] = useState(false)

    Popup.onCreate = () => {
        setIsOpen(true)
    }

    Popup.onClose = () => {
        setIsOpen(false)
    }

    return (
        <>
            <div className="popup_background" style={{display: (isOpen) ? "block": "none"}}></div>
            <div className="centered_content popup small" style={{display: (isOpen) ? "block": "none"}}>
                <div className="titlebar">
                    <h3 className='label title'>{Popup.title}</h3>
                    <div className="close" onClick={() => {Popup.onClose()}}><X /></div>
                </div>
                {Popup.content}
            </div>
        </>
    )
}