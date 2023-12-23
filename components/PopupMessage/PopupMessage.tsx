'use client'

import { useState } from 'react'
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

    type: PopupMessageType
    message: string
    endAction?: () => void

    constructor(type: PopupMessageType, message: string, endAction?: () => void) {
        this.type = type;
        this.message = message;
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
        if(this.queue[0].endAction) 
            this.endAction = this.queue[0].endAction

        this.onMessagePlay();
        setTimeout(() => {
            if(this.endAction) {
                this.endAction();
            }
            this.clearMessage();
        }, 4000)
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

    PopupMessage.onMessagePlay = () => {
        setMessage(PopupMessage.message);
        setType(PopupMessage.type);
        setDisplay(true)
    }

    PopupMessage.onMessageClear = () => {
        setDisplay(false);
    }

    return (
        <div className={styles.popup_container} style={{animationName: (display) ? styles.popIn: styles.popOut}}>
            <div className={(type === PopupMessageType.Alert) ? styles.popup_message_alert : (type === PopupMessageType.Warning) ? styles.popup_message_warning : styles.popup_message_error}>
                <p>{message}</p>
            </div>
        </div>
        
    )
}