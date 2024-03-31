import styles from './buttons.module.css'

export default function MainButton({onClick, className, children }: {onClick?: () => void, className?: string, children: React.ReactNode}) {
    return (
        <button type='button' onClick={onClick} className={`${className} ${styles.main_button}`}>{children}</button>
    )
}