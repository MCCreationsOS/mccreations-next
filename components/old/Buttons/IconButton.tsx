import { MouseEventHandler } from 'react'
import styles from './buttons.module.css'

/**
 * A simple main button - Button Components are simple shortcuts to create buttons with predefined styles
 * @param onClick The function to call when the button is clicked
 * @param className Additional classes to apply to the button
 * @param children The content of the button
 */
export default function IconButton({onClick, className, children }: {onClick?: MouseEventHandler, className?: string, children: React.ReactNode}) {
    return (
        <button type='button' onClick={onClick} className={`${(className) ? (styles[className]) ? styles[className] : className : ""} ${styles.icon_button}`}>{children}</button>
    )
}