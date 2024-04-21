import styles from './buttons.module.css'

/**
 * A simple warning button - Button Components are simple shortcuts to create buttons with predefined styles
 * @param onClick The function to call when the button is clicked
 * @param children The content of the button
 */
export default function WarningButton({onClick, children }: {onClick: () => void, children: React.ReactNode}) {
    return (
        <button onClick={onClick} className={styles.warning_button}>{children}</button>
    )
}