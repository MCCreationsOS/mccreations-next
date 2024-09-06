'use client'

import { Link } from "@/app/api/navigation";
import { ReactElement, useState } from "react";
import styles from "./Tabs.module.css"
import { useRouter } from "next/navigation";

export interface ITab {
    title: string | ReactElement,
    content: ReactElement,
    link?: string,
    disabled?: boolean
}

export default function Tabs({tabs, preselectedTab, onChangeTabs}: {tabs: ITab[], preselectedTab?: number, onChangeTabs?: (to: number, from: number) => void}) {
    if(!preselectedTab) preselectedTab = 0;
    const [selectedTab, setSelectedTab] = useState(preselectedTab);
    const router = useRouter();

    return (
        <>
            <div className={styles.tabs}>
                {tabs.map((tab, idx) => (<Link key={idx} href={(tab.link && !tab.disabled) ? tab.link! : "#"} onClick={() => {
                    if(tab.disabled) return;
                    if(onChangeTabs) onChangeTabs(idx, selectedTab);
                    setSelectedTab(idx)
                    }} className={(selectedTab === idx) ? styles.tab_link_selected : (tab.disabled) ? styles.tab_disabled : styles.tab_link} aria-disabled>{tab.title}</Link>))}
            </div>
            {tabs[selectedTab].content}
        </>
    )
}