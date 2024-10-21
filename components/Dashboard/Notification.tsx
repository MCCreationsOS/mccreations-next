import { Link } from "@/app/api/navigation";
import { INotification, IUser } from "@/app/api/types";
import { useTranslations } from "next-intl";

import styles from "./notification.module.css"
import { readNotification, useUserStore } from "@/app/api/auth";

export default function Notification({notification} : {notification : INotification}) {
    const t = useTranslations()
    const setNotifications = useUserStore((state) => state.setNotifications)
    const user = useUserStore() as IUser
    let link = notification.link

    if(link.includes("wall")) {
        let creator = link.split("/")[2]
        link = `/creator/${creator}#wall_title`
    } else {
        link = link + "#comments_title"
    }

    const handleClick = () => {
        readNotification(localStorage.getItem('jwt') + "", notification._id + "")

        setNotifications(user.notifications!.map((n) => {
            if(n._id === notification._id) {
                return {...n, read: true}
            }
            return n
        }))
    }

    return <Link href={link} className={styles.notification} onClick={handleClick}>
        <div className={styles.read_indicator} style={{backgroundColor: (notification.read) ? "#00000000" : "#c73030"}}></div>
        <p>{(typeof notification.title === 'string') ? notification.title : t(notification.title.key, notification.title.options)}</p>
        <p>{(typeof notification.body === 'string') ? notification.body : t(notification.body.key, notification.body.options)}</p>
    </Link>
}