'use client'

import { submitLeaderboard } from "@/app/api/community"
import { ContentTypes } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import Text from "@/components/FormInputs/Text"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/router"

export default function Page({params}: { params: Params}) {
    const query = useSearchParams()
    const score = parseInt(query.get("time") ?? "0")
    const score_type = query.get("score_type") ?? "time"
    const router = useRouter()

    const sendScore = async (inputs: string[]) => {
        let jwt = sessionStorage.getItem('jwt')
        const contentType = params.contentType as ContentTypes
        const slug = params.slug as string
        submitLeaderboard(contentType, slug, score, score_type, inputs[0], jwt + "")
        router.push(`/leaderboards/${contentType}/${slug}`)
    }

    return (
        <div className="centered_content">
            <h2>Submit Your Time</h2>
            {score_type === "time" && <p>Your time was {Math.floor(score / 60 / 60 / 20)} hours, {Math.floor((score / 60 / 20) % 60)} minutes, {Math.floor((score / 20) % 60)} seconds and {Math.floor(score % 20)} ticks</p>}
            {score_type !== "time" && <p>Your score was {score}</p>}
            <FormComponent id="submitScore" options={{saveButtonContent: "Submit"}} onSave={sendScore}>
                <Text name="Username" />
            </FormComponent>
        </div>
    )
}