import Image from "next/image";
import { IContentDoc } from "@/app/api/types";
import styles from './ContentScrollBackground.module.css'
import { useTranslations } from "next-intl";

/**
 * A special, uninteractable and stripped down card for the content scroll background
 * @param map The map to display
 * @param id The id of the card
 * @param priority Whether the image should be loaded with priority
 */
export default function ContentScrollCard({content, id, priority}: {content: IContentDoc, id: string, priority: boolean}) {
    const t = useTranslations();
    return (
        <div className={styles.content_card} id={id} >
            <div className={styles.information}>
                <Image priority={priority} className={styles.logo} src={content.images[0]} width={1920} height={1080} sizes="25vw" alt={t('Content.logo_alt', {title: content.title, type: content.type, minecraft_version: content.files[0].minecraftVersion, creator: content.creators[0].username})}></Image>
            </div>
        </div>
    )
}