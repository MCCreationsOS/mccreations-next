'use client'

import { Link } from "@/app/api/navigation";
import { useState } from "react"
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react";
import styles from './Message.module.css'
import {useTranslations} from 'next-intl';

export interface IMessage {
    type: 'Message' | 'Warning' | 'Error',
    title: string,
    message: string,
    link?: string
}

/**
 * A message component that displays messages, warnings, and errors
 * @param messages The messages to display
 */
export default function MessageComponent({messages}: {messages: IMessage[]}) {
        const [message, setMessage] = useState(0);
        const [visible, setVisible] = useState(true);
        const t = useTranslations()

        if(visible && messages[message]) {
            return (
                <div className={(messages[message].type === 'Message') ? styles.message_container : (messages[message].type === 'Warning') ? styles.warning_container : styles.error_container}>
                    <div className={styles.title_bar}>
                        <h4 className={styles.title}>{messages[message].title}</h4>
                        <div className={styles.options}>
                            <div className={styles.option}><p className={styles.option_text}>{message + 1} / {messages.length}</p></div>
                            <div className={styles.option} onClick={() => {if(message > 0) setMessage(message - 1); else setMessage(messages.length - 1)}}><ArrowLeft /></div>
                            <div className={styles.option} onClick={() => {if(message < messages.length - 1) setMessage(message + 1); else setMessage(0)}}><ArrowRight /></div>
                            <div className={styles.option} onClick={() => {setVisible(false); setMessage(0)}}><ChevronDown /></div>
                        </div>
                    </div>
                    <p className={styles.message}>{messages[message].message}</p>
                    {/* {(messages[message].link) ? <Link href={messages[message].link!}>{t('content.messages.fix')}</Link> : <></>} */}
                </div>
            )
        } else if( messages[message]) {
            return (
                <div className={(messages[message].type === 'Message') ? styles.message_container : (messages[message].type === 'Warning') ? styles.warning_container : styles.error_container}>
                    <div className={styles.title_bar}>
                        <h4 className={styles.title}>{t('Content.Warnings.count')}{messages.length}</h4>
                        <div className={styles.option} onClick={() => {setVisible(true)}}><ChevronUp /></div>
                    </div>
                </div>
            )
        }
}