'use client'

import { submitLeaderboard } from "@/app/api/community"
import { ContentTypes } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import Text from "@/components/FormInputs/Text"
import { useTranslations } from "next-intl"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function Page({params}: { params: Params}) {
    const t = useTranslations()
    const query = useSearchParams()
    const score = parseInt(query.get("time") ?? "0")
    const score_type = query.get("score_type") ?? "time"
    const router = useRouter()

    const sendScore = async (inputs: string[]) => {
        let jwt = localStorage.getItem('jwt')
        const contentType = params.contentType as ContentTypes
        const slug = params.slug as string
        submitLeaderboard(contentType, slug, score, score_type, inputs[0], jwt + "")
        router.push(`/leaderboards/${contentType}/${slug}`)
    }

    return (
        <div className="centered_content">
            {score_type === "time" && <h2>{t('Leaderboards.submit_time')}</h2>}
            {score_type !== "time" && <h2>{t('Leaderboards.submit_score')}</h2>}
            {score_type === "time" && <p>{t('Leaderboards.submit_time_description', {hours: Math.floor(score / 60 / 60 / 20), minutes: Math.floor((score / 60 / 20) % 60), seconds: Math.floor((score / 20) % 60), ticks: Math.floor(score % 20)})}</p>}
            {score_type !== "time" && <p>{t('Leaderboards.submit_score_description', {score: score})}</p>}
            <FormComponent id="submitScore" options={{saveButtonContent: t('Leaderboards.submit')}} onSave={sendScore}>
                <Text name={t('Leaderboards.username')} />
            </FormComponent>
        </div>
    )
}