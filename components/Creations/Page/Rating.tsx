'use client'

import { postRating } from "@/app/api/community";
import { getCookie, setCookie } from "@/app/setCookies";
import { IContentDoc } from "@/app/api/types";
import { useState, useEffect, useCallback } from "react";
import {useTranslations} from 'next-intl';
import { Button } from "@/components/ui/button";

export default function Rating(props: { value: number, currentRating: number, ratings: number[] | undefined, onRate: (value: number) => void, canChange?: boolean, showCount?: boolean, className?: string}) {
    const [value, setValue] = useState(props.value);
    const t = useTranslations()

    let ratingHover = (event: any) => {
        if(props.canChange === false) return;
        let value = Math.floor(((event.pageX - event.currentTarget.offsetLeft) / 12.0) + 2)
        value = (Math.floor(value/2))/5
        setValue(value)
    }

    return (
        <div className={`flex flex-row gap-2 items-center ${props.className}`}>
            <ul className="rating" onMouseMove={(e) => {ratingHover(e)}} onMouseLeave={() => {setValue(props.value)}}>
                <li className="current_rating" style={{width: value*100 + '%'}}></li>
                <li><Button variant="none" role="button" className="w-6 h-4 p-0" id="one" title={t('Components.Creations.Page.Rating.1')} onClick={() => {props.onRate(0.2)}}></Button></li>
                <li><Button variant="none" role="button" className="w-6 h-4 p-0" id="two" title={t('Components.Creations.Page.Rating.2')} onClick={() => {props.onRate(0.4)}}></Button></li>
                <li><Button variant="none" role="button" className="w-6 h-4 p-0" id="three" title={t('Components.Creations.Page.Rating.3')} onClick={() => {props.onRate(0.6)}}></Button></li>
                <li><Button variant="none" role="button" className="w-6 h-4 p-0" id="four" title={t('Components.Creations.Page.Rating.4')} onClick={() => {props.onRate(0.8)}}></Button></li>
                <li><Button variant="none" role="button" className="w-6 h-4 p-0" id="five" title={t('Components.Creations.Page.Rating.5')} onClick={() => {props.onRate(1)}}></Button></li>
            </ul>
            {props.showCount && <span className="text-md">{(props.currentRating * 5).toFixed(1)} ({props.ratings?.length ?? 0})</span>}
        </div>
    )
}