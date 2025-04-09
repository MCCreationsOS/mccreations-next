import styles from './Badge.module.css'

/**
 * A simple Badge
 * @param children The content of the badge
 * @param color The color of the badge, must also be defined in the css module 
 */
export default function Badge({children, color}: {children?: React.ReactNode, color?: string}) {
  return (
    <span className={`${styles.badge} ${(color) ? styles[color]: ""}`}>{children}</span>
  )
}