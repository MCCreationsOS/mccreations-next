import styles from './buttons.module.css'

export default function WarningButton({onClick, children }: {onClick: () => void, children: React.ReactNode}) {
    return (
        <button onClick={onClick} className={styles.warning_button}>{children}</button>
    )
}