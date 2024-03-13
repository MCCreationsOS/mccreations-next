'use client'

import Link from "next/link";
import { useState } from "react"
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X } from "react-feather";
import styles from './Message.module.css'

export interface IMessage {
    type: 'Message' | 'Warning' | 'Error',
    title: string,
    message: string,
    link?: string
}

export default function MessageComponent({messages}: {messages: IMessage[]}) {
        const [message, setMessage] = useState(0);
        const [visible, setVisible] = useState(true);

        if(visible && messages[message]) {
            return (
                <div className={(messages[message].type === 'Message') ? styles.message_container : (messages[message].type === 'Warning') ? styles.warning_container : styles.error_container}>
                    <div className={styles.title_bar}>
                        <h4 className={styles.title}>{messages[message].title}</h4>
                        <div className={styles.options}>
                            <div className={styles.option}><p className={styles.option_text}>{message + 1}</p></div>
                            <div className={styles.option} onClick={() => {if(message > 0) setMessage(message - 1); else setMessage(messages.length - 1)}}><ArrowLeft /></div>
                            <div className={styles.option} onClick={() => {if(message < messages.length - 1) setMessage(message + 1); else setMessage(0)}}><ArrowRight /></div>
                            <div className={styles.option} onClick={() => {setVisible(false); setMessage(0)}}><ChevronDown /></div>
                        </div>
                    </div>
                    <p className={styles.message}>{messages[message].message}</p>
                    {(messages[message].link) ? <Link href={messages[message].link!}>Fix it</Link> : <></>}
                </div>
            )
        } else if( messages[message]) {
            return (
                <div className={(messages[message].type === 'Message') ? styles.message_container : (messages[message].type === 'Warning') ? styles.warning_container : styles.error_container}>
                    <div className={styles.title_bar}>
                        <h4 className={styles.title}>Messages: {messages.length}</h4>
                        <div className={styles.option} onClick={() => {setVisible(true)}}><ChevronUp /></div>
                    </div>
                </div>
            )
        }
}