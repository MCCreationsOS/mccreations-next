'use client'

import { useEffect, useState } from 'react'
import styles from './PopupMessage.module.css'

export enum PopupMessageType {
    Alert,
    Warning,
    Error
}

export class PopupMessage {
    static type: PopupMessageType
    static message: string
    static queue: PopupMessage[] = []
    static active: boolean
    static onMessagePlay: () => void
    static onMessageClear: () => void
    static endAction: () => void;
    static time: number | undefined
    
    type: PopupMessageType
    message: string
    time: number = 4000
    endAction?: () => void

    constructor(type: PopupMessageType, message: string, endAction?: () => void, time?: number) {
        this.type = type;
        this.message = message;
        this.time = time || 4000;
        this.endAction = endAction;
    }
    
    static addMessage(message: PopupMessage) {
        this.queue.push(message);
        if(!this.active) {
            this.playMessages()
        }
    }

    static playMessages() {
        this.active = true
        this.type = this.queue[0].type
        this.message = this.queue[0].message
        this.time = this.queue[0].time
        if(this.queue[0].endAction) 
            this.endAction = this.queue[0].endAction

        this.onMessagePlay();
        setTimeout(() => {
            if(this.endAction) {
                this.endAction();
            }
            this.clearMessage();
        }, this.time)
    }

    static clearMessage() {
        this.active = false;
        this.queue.shift();
        this.onMessageClear();
        if(this.queue.length > 0) {
            setTimeout(() => {
                this.playMessages();
            }, 500)
        }
    }
}

export default function PopupMessageComponent() {
    const [message, setMessage] = useState("")
    const [type, setType] = useState(PopupMessageType.Alert)
    const [display, setDisplay] = useState(false)
    const [displayTime, setDisplayTime] = useState(0)

    PopupMessage.onMessagePlay = () => {
        setMessage(PopupMessage.message);
        setType(PopupMessage.type);
        setDisplay(true)
        setDisplayTime(0)
    }

    PopupMessage.onMessageClear = () => {
        setDisplay(false);
        setTimeout(() => {
            setMessage("")
        }, 200)
    }

    useEffect(() => {
        updateDisplayTime();
    }, [display, displayTime])

    const updateDisplayTime = () => {
        if(display) {
            setTimeout(() => {
                setDisplayTime(displayTime + 1)
            }, 1)
        }
    }

    return (
        <div className={styles.popup_container} style={{animationName: (display) ? styles.popIn: styles.popOut}}>
            <div className={(type === PopupMessageType.Alert) ? styles.popup_message_alert : (type === PopupMessageType.Warning) ? styles.popup_message_warning : styles.popup_message_error}>
                <p>{message}</p>
                <div className={styles.time} style={{width: `${displayTime/(PopupMessage.time!/1500)}%`}}></div>
            </div>
        </div>
        
    )
}