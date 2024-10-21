import Link from "next/link";
import styles from "./AccountSidebar.module.css"

export default function Layout({ children }: { children: React.ReactNode}) {
    return <div className="centered_content small">
        <h1>Settings</h1>
        <div className={styles.account_layout}>
            <nav className={styles.account_navigation}>
                <Link className={styles.account_navigation_link} href="/settings/account">Account</Link>
                <Link className={styles.account_navigation_link} href="/settings/notifications">Notifications</Link>
            </nav>
            {children}
        </div>
    </div>
    
}