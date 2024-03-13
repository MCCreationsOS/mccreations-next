'use client'

import Link from "next/link";
import { ReactElement, useState } from "react";
import styles from "./Tabs.module.css"
import { useRouter } from "next/navigation";

export interface ITab {
    title: string | ReactElement,
    content: ReactElement,
    link?: string,
    disabled?: boolean
}

export default function Tabs({tabs, preselectedTab}: {tabs: ITab[], preselectedTab?: number}) {
    if(!preselectedTab) preselectedTab = 0;
    const [selectedTab, setSelectedTab] = useState(preselectedTab);
    const router = useRouter();

    return (
        <>
            <div className={styles.tabs}>
                {tabs.map((tab, idx) => (<Link key={idx} href={(tab.link && !tab.disabled) ? tab.link! : "#"} onClick={() => {
                    if(tab.disabled) return;

                    setSelectedTab(idx)
                    }} className={(selectedTab === idx) ? styles.tab_link_selected : (tab.disabled) ? styles.tab_disabled : styles.tab_link} aria-disabled>{tab.title}</Link>))}
            </div>
            {tabs[selectedTab].content}
        </>
    )
}