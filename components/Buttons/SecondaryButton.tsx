import styles from './buttons.module.css'

export default function SecondaryButton({onClick, children }: {onClick: () => void, children: React.ReactNode}) {
    return (
        <button onClick={onClick} className={styles.secondary_button}>{children}</button>
    )
}