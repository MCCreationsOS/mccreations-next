'use client'

import { ReactElement, useEffect, useRef, useState } from "react"
import { X } from "react-feather"
import styles from './Popup.module.css'

export interface PopupProps {
    content?: React.ReactNode
    title?: string
    canClose?: boolean,
    useBackground?: boolean,
    children?: React.ReactNode
}

export class Popup {
    static title?: string
    static canClose: boolean
    static onClose: () => void
    static onCreate: (p: PopupProps) => void
    static content: React.ReactNode
    static useBackground: boolean

    static createPopup(props: PopupProps) {

        if(props.content)
            Popup.content = props.content;

        if(props.title) {
            Popup.title = props.title;
        }

        if(props.canClose) {
            Popup.canClose = props.canClose
        } else {
            Popup.canClose = true;
        }

        if(props.useBackground) {
            Popup.useBackground = props.useBackground
        } else {
            Popup.useBackground = true;
        }

        Popup.onCreate({
            content: Popup.content,
            title: Popup.title,
            canClose: Popup.canClose,
            useBackground: Popup.useBackground
        });
    }

    static close() {
        Popup.onClose();
        Popup.title = undefined;
        Popup.content = undefined;
    }
}

export default function PopupComponent(props: PopupProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [classProps, setProps] = useState<PopupProps | undefined>(props)
    const popup = useRef<HTMLDivElement>(null)

    useEffect(() => {
        popup.current?.scrollIntoView({behavior: "smooth", inline: "start", block: "center"})
    }, [isOpen])

    if(classProps?.children) {
        return (
            <>
                <div className={styles.background} style={{display: (isOpen && classProps.useBackground) ? "block": "none"}}></div>
                <div className={`${styles.popup} ${styles.inline}`}>
                    {(classProps.title || classProps.canClose) ? <div className={styles.titlebar}>
                        <h3 className={styles.title}>{classProps.title}</h3>
                    </div> : <></>}
                    {classProps.children}
                </div>
            </>
        )
    } else {
        Popup.onCreate = (p: PopupProps) => {
            setProps(p)
            setIsOpen(true)
        }
    
        Popup.onClose = () => {
            setProps(undefined)
            setIsOpen(false)
        }
        
        return (
            <>
                <div className={`${styles.background} ${isOpen ? styles.visible : styles.hidden}`}></div>
                <div ref={popup} className={`${styles.popup} ${(isOpen) ? styles.visible : styles.hidden}`}>
                    {(Popup.title || Popup.canClose) ? <div className={styles.titlebar}>
                        <h3 className={styles.title}>{Popup.title}</h3>
                        <div className={styles.close} onClick={() => {Popup.onClose()}}><X /></div>
                    </div>: <></>}
                    {classProps?.content}
                </div>
            </>
        )
    }

}