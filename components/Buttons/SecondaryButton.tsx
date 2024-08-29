import styles from './buttons.module.css'

/**
 * A simple secondary button - Button Components are simple shortcuts to create buttons with predefined styles
 * @param onClick The function to call when the button is clicked
 * @param children The content of the button
 */
export default function SecondaryButton({onClick, className, children }: {onClick?: () => void, className?: string, children: React.ReactNode}) {
    return (
        <button type='button' onClick={onClick} className={`${className} ${styles.secondary_button}`}>{children}</button>
    )
}