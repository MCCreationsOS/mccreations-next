'use client'

import { adUnits } from "@/app/api/ads"
import { useEffect, useState } from "react"
import styles from './Ads.module.css'
import Script from "next/script"
import { useTranslations } from "next-intl"

export default function InContentAdUnit() {
    const [isClient, setIsClient] = useState(false)
    const [adUnit, setAdUnit] = useState("")

    useEffect(() => {
        let foundAdUnit = false
        adUnits.forEach(unit => {
            if (!unit.inUse && adUnit.length === 0 && !foundAdUnit) {
                setAdUnit(unit.id)
                unit.inUse = true
                foundAdUnit = true
            } else if (adUnit.length !== 0 && unit.id === adUnit) {
                unit.inUse = false
                setAdUnit("")
            }

        })
        setIsClient(true)
    }, [])
    return (
        <div className={styles.in_content_ad}>
            {isClient && <div>
                <AdsenseComponent adSlot={7972645086} adFormat={"fluid"} adClient='ca-pub-5425604215170333' adLayout="-7p+f2-1p-4p+ez" width="100%" height="100%" />
            </div>
            }
            <input type="hidden" value={adUnit + ""} />
        </div>
    )
}

export const InListAdUnit = () => {
    const [isClient, setIsClient] = useState(false)
    const [adUnit, setAdUnit] = useState("")

    useEffect(() => {
        let foundAdUnit = false
        adUnits.forEach(unit => {
            if (!unit.inUse && adUnit.length === 0 && !foundAdUnit) {
                setAdUnit(unit.id)
                unit.inUse = true
                foundAdUnit = true
            } else if (adUnit.length !== 0 && unit.id === adUnit) {
                unit.inUse = false
                setAdUnit("")
            }

        })
        setIsClient(true)
    }, [])
    return (
        <div className={styles.in_list_ad}>
            {isClient && <div className="h-full w-full">
                <AdsenseComponent adSlot={7972645086} adFormat={"fluid"} adClient='ca-pub-5425604215170333' adLayout="-7p+f2-1p-4p+ez" width="100%" height="100%" />
            </div>
            }
            <input type="hidden" value={adUnit + ""} />
        </div>
    )
}


export const AdsenseComponent = ({ adClient, adSlot, adFormat, adLayout, width, height }) => {
    const [render, setRender] = useState(true);
    const t = useTranslations();

    useEffect(() => {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
        }
    }, []);

    useEffect(() => {
        if(render) {
            let unFilledIns = document.querySelectorAll('ins.adsbygoogle[data-adsbygoogle-status="done"]');
            if(unFilledIns.length == 0) return;
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (err) {
            }
            setTimeout(() => {
                setRender(false)
            }, 30000)
        } else {
            setRender(true)
        }
    }, [render])

    if (!render) return null;
    return (
        <div>
            <div className={styles.background}>{t('Components.AdUnits.behind_text')}</div>
            <ins className="adsbygoogle"
                style={{ display: 'block', width: width, height: height, margin: '0 auto' }}
                data-ad-client={adClient}
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
                data-ad-layout-key={adLayout}></ins>
        </div>
    );
};