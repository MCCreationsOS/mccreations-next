'use client';
import { use } from "react";

import { submitLeaderboard } from "@/app/api/community"
import { ContentTypes } from "@/app/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "@tanstack/react-form"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function Page(props: { params: Promise<{locale: string, contentType: ContentTypes, slug: string}>}) {
    const params = use(props.params);
    const form = useForm({
        defaultValues: {
            username: ""
        }
    })
    const t = useTranslations()
    const query = useSearchParams()
    const score = parseInt(query.get("time") ?? "0")
    const score_type = query.get("score_type") ?? "time"
    const router = useRouter()

    const sendScore = async (inputs: string[]) => {
        let jwt = localStorage?.getItem('jwt')
        const contentType = params.contentType as ContentTypes
        const slug = params.slug as string
        submitLeaderboard(contentType, slug, score, score_type, inputs[0], jwt + "")
        router.push(`/leaderboards/${contentType}/${slug}`)
    }

    return (
        <div className="centered_content">
            {score_type === "time" && <h2>{t('Pages.Leaderboards.contentType.slug.Submit.submit_time')}</h2>}
            {score_type !== "time" && <h2>{t('Pages.Leaderboards.contentType.slug.Submit.submit_score')}</h2>}
            {score_type === "time" && <p>{t('Pages.Leaderboards.contentType.slug.Submit.submit_time_description', {hours: Math.floor(score / 60 / 60 / 20), minutes: Math.floor((score / 60 / 20) % 60), seconds: Math.floor((score / 20) % 60), ticks: Math.floor(score % 20)})}</p>}
            {score_type !== "time" && <p>{t('Pages.Leaderboards.contentType.slug.Submit.submit_score_description', {score: score})}</p>}
            <form onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(sendScore);
            }}>
                <form.Field name="username" children={(field) => (
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username">{t('Pages.Leaderboards.contentType.slug.Submit.username')}</Label>
                        <Input id="username" name="username" defaultValue={field.state.value} onChange={(e) => {
                            field.handleChange(e.target.value);
                        }} />
                    </div>
                )} />
                <Button type="submit" className="w-fit">{t('Pages.Leaderboards.contentType.slug.Submit.submit')}</Button>
            </form>
        </div>
    )
}