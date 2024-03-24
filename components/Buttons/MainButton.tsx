import styles from './buttons.module.css'

export default function MainButton({onClick, children }: {onClick?: () => void, children: React.ReactNode}) {
    return (
        <button type='button' onClick={onClick} className={styles.main_button}>{children}</button>
    )
}