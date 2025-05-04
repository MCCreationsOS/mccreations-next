import { searchContent } from "@/app/api/content";
import { useCreations } from "@/app/api/hooks/creations";
import { IContentDoc } from "@/app/api/types";
import CreationCard from "../Cards/Card";
import { useTranslations } from "next-intl";

export default function RecommendedCreations({creation}: {creation: IContentDoc}) {
    const t = useTranslations();
    let tag = creation.tags[Math.floor(Math.random() * creation.tags.length)]
    const {creations} = useCreations({limit: 4, includeTags: tag, contentType: "content"}, {search: creation.title, contentType: "content", limit: 1})
    return (
        <div>
            <h2>Other {t(`Creation.Tags.${tag}`)} Creations</h2>
            <div className="flex flex-col gap-4">
                {creations.slice(0, 3).map(creation => <CreationCard creation={creation} key={creation._id} playlist="" index={0} priority={false}/>)}
            </div>
        </div>
    )
}
