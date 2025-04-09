'use client'
import { searchContent } from "@/app/api/content";
import ContentScrollGrid from "./ContentScrollGrid";
import { useEffect, useState } from "react";
import styles from './ContentScrollBackground.module.css'
import { useCreations } from "@/app/api/hooks/creations";

/**
 * The special Map Scroll background used on the sign up page.
 */
export default function MapScroll() {
    const {creations, isLoading, error} = useCreations({contentType: "content", status: 3, limit: 60})

    return (
        <div className={styles.map_scroll}>
            <ContentScrollGrid content={creations} />
            <ContentScrollGrid content={creations} />
        </div>
    )
}