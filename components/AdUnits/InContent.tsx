'use client'

import { adUnits } from "@/app/api/ads"
import { useEffect, useState } from "react"
import { AdUnit } from "next-google-adsense";
import styles from './Ads.module.css'
import Script from "next/script"

export default function InContentAdUnit() {
    const [isClient, setIsClient] = useState(false)
    const [adUnit, setAdUnit] = useState("")
 
    useEffect(() => {
        let foundAdUnit = false
        adUnits.forEach(unit => {
            if(!unit.inUse && adUnit.length === 0 && !foundAdUnit) {
                console.log("Found ad unit not in use")
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
        <div>
        {isClient && adUnit && <>
            <AdUnit slotId={"4342982066"} layout="custom" publisherId='ca-pub-5425604215170333' customLayout={InFeedAdUnit()}/>
        </>
        }
        <input type="hidden" value={adUnit + ""} />
        </div>
    )
}

const InFeedAdUnit = () => {
    return (
        <ins className="adsbygoogle"
            style={{display: "block"}}
            data-ad-format="fluid"
            data-ad-layout-key="-7p+f2-1p-4p+ez"
            data-ad-client="ca-pub-5425604215170333"
            data-ad-slot="4342982066"
        />
    )
}