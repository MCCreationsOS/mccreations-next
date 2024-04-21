import Image from "next/image";
import { IMap } from "@/app/types";
import styles from './ContentScrollBackground.module.css'

/**
 * A special, uninteractable and stripped down card for the content scroll background
 * @param map The map to display
 * @param id The id of the card
 * @param priority Whether the image should be loaded with priority
 */
export default function ContentScrollCard({map, id, priority}: {map: IMap, id: string, priority: boolean}) {
    return (
        <div className={styles.content_card} id={id} >
            <div className={styles.information}>
                <Image priority={priority} className={styles.logo} src={map.images[0]} width={1920} height={1080} sizes="25vw" alt={`The logo for ${map.title}, a Minecraft Map for ${map.files[0].minecraftVersion} by ${map.creators[0].username}`}></Image>
            </div>
        </div>
    )
}