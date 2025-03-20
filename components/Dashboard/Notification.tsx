import { Link } from "@/app/api/navigation";
import { INotification } from "@/app/api/types";
import { useTranslations } from "next-intl";

import styles from "./notification.module.css"
import { readNotification } from "@/app/api/auth";
import { useUser, useToken } from "@/app/api/hooks/users";

export default function Notification({notification} : {notification : INotification}) {
    const t = useTranslations()
    const {token} = useToken()
    let link = notification.link

    if(link.includes("wall")) {
        let creator = link.split("/")[2]
        link = `/creator/${creator}#wall_title`
    } else {
        link = link + "#comments_title"
    }

    const handleClick = () => {
        readNotification(token + "", notification._id + "")
    }

    return <Link href={link} className={styles.notification} onClick={handleClick}>
        <div className={styles.read_indicator} style={{backgroundColor: (notification.read) ? "#00000000" : "#c73030"}}></div>
        <p>{(typeof notification.title === 'string') ? notification.title : t(notification.title.key, notification.title.options)}</p>
        <p>{(typeof notification.body === 'string') ? notification.body : t(notification.body.key, notification.body.options)}</p>
    </Link>
}