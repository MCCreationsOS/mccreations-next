import styles from './Badge.module.css'

export default function Badge({children, color}: {children?: React.ReactNode, color?: string}) {
  return (
    <span className={`${styles.badge} ${(color) ? styles[color]: ""}`}>{children}</span>
  )
}