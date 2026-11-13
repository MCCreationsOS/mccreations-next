import styles from "./dashboard.module.css"
import DashboardNav from "./DashboardNav"

export default function Layout(props: {children: React.ReactNode}) {
    return (
        <div className="m-2 flex flex-col md:flex-row gap-10">
            <DashboardNav />
            <div className={styles.dashboard_content}>{props.children}</div>
        </div>
    )
}
