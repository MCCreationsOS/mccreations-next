'use client'

import { Link } from "@/app/api/navigation";
import Image from "next/image";
import { Image as ImageIcon, Trash } from "react-feather";
import { Edit } from "react-feather";
import styles from './table.module.css'
import { CollectionNames, IContentDoc, IUser } from "@/app/api/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser, useUserStore } from "@/app/api/auth";
import { convertToType, deleteContent } from "@/app/api/content";
import {useTranslations} from 'next-intl';

export default function Table({collectionName}: {collectionName: CollectionNames}) {
    const [maps, setMaps] = useState<IContentDoc[]>([])
    const user = useUserStore() as IUser
    const setUser = useUserStore((state) => state.setUser)
    const router = useRouter();
    const contentType = convertToType(collectionName);
    const t = useTranslations()

    useEffect(() => {
        if(!user._id) {
            getUser(localStorage?.getItem('jwt') + "").then((u) => {
                if(u) {
                    setUser(u)
                }
            })
        }
    }, [])

    useEffect(() => {
        if(user._id) {
            getOwnedContent(localStorage?.getItem('jwt') + "")
        }
    }, [user])

    const getOwnedContent = async (jwt: any) => {
        fetch(`${process.env.DATA_URL}/${collectionName}-nosearch?status=0&limit=20&page=0&creator=${user?.handle}`, {
            headers: {
                authorization: jwt + ""
            }
        }).then((res) => {
            res.json().then((data) => {
                setMaps(data.documents)
            })
        })
    }
    
    return (
        <>
            <div className={styles.content_item}>
                    <div className={styles.content_item_item}>
                    </div>
                    <div className={styles.info_container}>
                        <p>{t('Dashboard.info')}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{t('Dashboard.status')}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{t('Dashboard.created_date')}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{t('Dashboard.updated_date')}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{t('Dashboard.downloads')}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{t('Dashboard.rating')}</p>
                    </div>
                </div>
            {maps && maps.map((map: IContentDoc, idx) => (
                <div className={styles.content_item} key={map.slug}>
                    <div className={styles.content_item_item}>
                        <Image className={styles.logo} src={map.images[0]} width={160} height={90} alt=""></Image>
                    </div>
                    <div className={styles.info_container}>
                        <p className={styles.content_title}>{map.title}</p>
                        <p className={styles.content_description}>{map.shortDescription}</p>
                        <div className={styles.info_buttons}>
                            <Link href={`/${contentType}s/${map.slug}`} title={t('Dashboard.view')}><ImageIcon /></Link>
                            <Link href={`/edit/${contentType}/${map.slug}`} title={t('Dashboard.edit')}><Edit /></Link>
                            <span style={{color: 'red'}} onClick={() => {deleteContent(map._id, localStorage?.getItem('jwt'), collectionName); getOwnedContent(localStorage?.getItem('jwt'))}}><Trash /></span>
                        </div>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{(map?.status === 0) ? <span style={{color: "#c73030"}}>{t('Status.draft')}</span> : (map?.status === 1) ? <span style={{color: "#f0b432"}}>{t('Status.unapproved')}</span> : (map?.status === 2) ? <span style={{color: "#10b771"}}>{t('Status.approved')}</span>: <span style={{color:"#3154f4"}}>{t('Status.featured')}</span>}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.createdDate && new Date(map.createdDate).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.updatedDate && new Date(map.updatedDate).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{map.downloads}</p>
                    </div>
                    <div className={styles.content_item_item}>
                        <p>{(map.rating * 5).toFixed(2)}</p>
                    </div>
                </div>
            ))}
        </>
    )
}