'use client'

import { adUnits } from "@/app/api/ads"
import { useEffect, useState } from "react"
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
        <>
        {isClient && <>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5425604215170333"
                crossOrigin="anonymous"></script>
            <ins className="adsbygoogle"
                style={{ display: isClient ? "block" : "none" }}
                data-ad-format="fluid"
                data-ad-layout-key="-7p+eu-10-1k+6x"
                data-ad-client="ca-pub-5425604215170333"
                data-ad-slot={adUnit}></ins>
            <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
            </script>
            </>
        }
        </>
    )
}