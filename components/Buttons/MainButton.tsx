import styles from './buttons.module.css'

/**
 * A simple main button - Button Components are simple shortcuts to create buttons with predefined styles
 * @param onClick The function to call when the button is clicked
 * @param className Additional classes to apply to the button
 * @param children The content of the button
 */
export default function MainButton({onClick, className, children }: {onClick?: () => void, className?: string, children: React.ReactNode}) {
    return (
        <button type='button' onClick={onClick} className={`${className} ${styles.main_button}`}>{children}</button>
    )
}