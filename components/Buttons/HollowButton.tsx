import styles from './buttons.module.css'

export default function HollowButton({onClick, children }: {onClick?: () => void, children: React.ReactNode}) {
    return (
        <button onClick={onClick} className={styles.hollow_button}>{children}</button>
    )
}