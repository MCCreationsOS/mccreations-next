import Link from "next/link";
import { ReactElement, useState } from "react";
import styles from "./Tabs.module.css"

export interface ITab {
    title: string,
    content: ReactElement
}

export default function Tabs({tabs}: {tabs: ITab[]}) {
    const [selectedTab, setSelectedTab] = useState(0);

    return (
        <>
            <div className={styles.tabs}>
                {tabs.map((tab, idx) => (<Link key={idx} href={"#"} onClick={() => {setSelectedTab(idx)}} className={(selectedTab === idx) ? styles.tab_link_selected : styles.tab_link}>{tab.title}</Link>))}
            </div>
            {tabs[selectedTab].content}
        </>
    )
}