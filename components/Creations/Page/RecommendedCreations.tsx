import { useCreations } from "@/app/api/hooks/creations";
import { IContentDoc } from "@/app/api/types";
import { tagLabel } from "@/app/api/utils";
import CreationCard from "../Cards/Card";
import { useTranslations } from "next-intl";

// Choose a deterministic tag for a creation
function pickTag(creation: IContentDoc) {
    const tags = (creation.tags ?? []).filter((tag) => tag.length > 0)
    if (tags.length === 0) return undefined
    let hash = 0
    for (const char of creation.slug ?? "") hash = (hash * 31 + char.charCodeAt(0)) | 0
    return tags[Math.abs(hash) % tags.length]
}

export default function RecommendedCreations({ creation }: { creation: IContentDoc }) {
    const t = useTranslations();
    const tag = pickTag(creation)
    // Ask for one extra so there are still three after removing this creation
    const { creations } = useCreations({ limit: 4, includeTags: tag, contentType: "content" })
    const recommended = creations.filter((c) => c._id !== creation._id).slice(0, 3)

    if (!tag || recommended.length === 0) return null

    return (
        <div className="hidden md:block my-5">
            <h2 className="text-2xl font-bold my-2">{t('Components.Creations.Page.recommended_creations', { tag: tagLabel(t, tag) })}</h2>
            <div className="container">
                <div className="grid grid-cols-3 gap-2 w-full">
                    {recommended.map(c => <CreationCard creation={c} key={c._id} playlist="" index={0} priority={false} />)}
                </div>
            </div>
        </div>
    )
}
