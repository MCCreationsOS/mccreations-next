'use client'

import { postRating } from "@/app/api/community";
import { getCookie, setCookie } from "@/app/setCookies";
import { IContentDoc } from "@/app/api/types";
import { useState, useEffect } from "react";
import {useTranslations} from 'next-intl';
import { Button } from "@/components/ui/button";

const STEPS = [0.2, 0.4, 0.6, 0.8, 1]
const IDS = ["one", "two", "three", "four", "five"]

/**
 * Sends a rating once per creation per browser.
 * @returns the creation's new average, "already_rated" or "error"
 */
export async function submitRating(value: number, creation: IContentDoc): Promise<number | "already_rated" | "error"> {
    const cookieName = "RATED_" + creation._id
    if (await getCookie(cookieName)) return "already_rated"
    const newRating = await postRating(value, creation)
    if (newRating === undefined || Number.isNaN(newRating)) return "error"
    await setCookie(cookieName, "true")
    return newRating
}

export default function Rating(props: { value: number, currentRating: number, ratings: number[] | undefined, onRate: (value: number) => void, canChange?: boolean, showCount?: boolean, className?: string}) {
    const [value, setValue] = useState(props.value);
    const t = useTranslations()
    const canChange = props.canChange !== false

    useEffect(() => {
        setValue(props.value)
    }, [props.value])

    const ratingHover = (event: React.MouseEvent<HTMLUListElement>) => {
        if(!canChange) return;
        const rect = event.currentTarget.getBoundingClientRect()
        const fraction = (event.clientX - rect.left) / rect.width
        setValue(Math.min(1, Math.max(0.2, Math.ceil(fraction * 5) / 5)))
    }

    return (
        <div className={`flex flex-row gap-2 items-center ${props.className ?? ""}`}>
            <ul className="rating" onMouseMove={ratingHover} onMouseLeave={() => {setValue(props.value)}} aria-label={t('Components.Creations.Page.Rating.label', {rating: (props.currentRating * 5).toFixed(1)})}>
                <li className="current_rating" style={{width: value*100 + '%'}}></li>
                {canChange && STEPS.map((step, index) => (
                    <li key={step}>
                        <Button type="button" variant="none" className="w-6 h-4 p-0" id={IDS[index]} title={t(`Components.Creations.Page.Rating.${index + 1}`)} aria-label={t(`Components.Creations.Page.Rating.${index + 1}`)} onFocus={() => setValue(step)} onBlur={() => setValue(props.value)} onClick={() => {props.onRate(step)}}></Button>
                    </li>
                ))}
            </ul>
            {props.showCount && <span className="text-md">{(props.currentRating * 5).toFixed(1)} ({props.ratings?.length ?? 0})</span>}
        </div>
    )
}
