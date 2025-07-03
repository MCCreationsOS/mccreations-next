import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { shimmer, toBase64 } from "./imageShimmer";
import styles from "@/components/Creations/Cards/Card.module.css"
import { Badge } from "../ui/badge";
import { Download } from "lucide-react";

export default function CardSkeleton() {
    return (
        <div className="bg-card border-gray-950 border-2 card-shadow group transition-all duration-200 group-hover:bg-card-hover relative overflow-hidden">
            <div className="overflow-hidden aspect-video relative border-gray-950 border-b-2">
                    <Image src={`data:image/svg+xml;base64,${toBase64(shimmer(1280, 720))}`} className="group-hover:scale-105 transition-all duration-200 border-b object-cover aspect-video" width={1280} height={720} sizes="25vw" alt="Loading..."></Image>
                    <div className="absolute bottom-1 right-1 flex flex-row gap-1">
                    </div>
                </div>
            <div className="p-2 mb-2">
                <h2 className="mb-1">Loading...</h2>
                <div className="line-clamp-2 text-sm text-muted-foreground">
                </div>
                <div className={styles.stats}>
                    <div className={styles.stat}><Download className={styles.in_text_icon} /></div>
                </div>
            </div>
        </div>
    )
}