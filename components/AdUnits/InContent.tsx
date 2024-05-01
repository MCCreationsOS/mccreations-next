'use client'

import { useEffect, useState } from "react"

export default function InContentAdUnit() {
    const [isClient, setIsClient] = useState(false)
 
    useEffect(() => {
      setIsClient(true)
    }, [])
    return (
        <>
        {isClient && <>
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5425604215170333"
                    crossOrigin="anonymous"></script>
                <ins className="adsbygoogle"
                    style={{display: 'block'}}
                    data-ad-format="fluid"
                    data-ad-layout-key="-7p+eu-10-1k+6x"
                    data-ad-client="ca-pub-5425604215170333"
                    data-ad-slot="7972645086"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </>}
        </>
    )
}