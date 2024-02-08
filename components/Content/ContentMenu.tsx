import { ICreator } from "@/app/types";
import Tabs from "../Tabs/Tabs";
import styles from "./Content.module.css"
import EditContentButton from "./EditContentButton";

export default function ContentMenu({slug, creators}: {slug: string, creators: ICreator[]}) {
    return (
        <div className={styles.content_submenu}>
            <div className={styles.content_tabs}>
                <Tabs tabs={[
                    {title: "Info", content: <></>, link: "/"},
                    {title: "Files", content: <></>, link: "/files", disabled: true},
                    {title: "Community", content: <></>, link: "/community", disabled: true}
                    ]} />
                <EditContentButton slug={slug} creators={creators}/>
            </div>
        </div>
    )
}