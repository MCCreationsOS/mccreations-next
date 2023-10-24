'use client'
const fetch = require('node-fetch')

import ContentGrid from "@components/ContentGrid"
import ContentCard from "@components/ContentCard"
import Menu from "@components/Menu"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { getMaps } from "app/getData"
import { useEffect, useState } from "react"
import { useCallback } from "react"

// const client = contentful.createClient({
//     space: 'xfoauilnv892',
//     accessToken:  process.env.CONTENTFUL_ACCESS_KEY
// })

// async function getMaps() {
//     const res = await client.getEntries({
//         content_type: 'content',
//         'fields.state': 1
//     })

//     return res.items;
// }

export default function Maps() {
    const [maps, setMaps] = useState([])
    const pathname = usePathname()
    const searchParams = useSearchParams()

    let skipAmount = Number.parseInt(searchParams.get("skip"));
    if(!skipAmount) {
        skipAmount = 0;
    }

    useEffect(() => {
        findMaps()
    }, [skipAmount])

    const findMaps = async () => {
        let m = await getMaps({sort: "newest", limit: 20, skip: skipAmount})
        setMaps(m);
    }

    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
    
    return (
        <div>
            <Menu selectedPage='maps'></Menu>
                <div>
                    <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map}></ContentCard>)}>
                    
                    </ContentGrid>
                </div>
                <Link href={pathname + '?' + createQueryString('skip', skipAmount + 20)}>Next</Link>
                <Link href={(skipAmount > 0) ? pathname + '?' + createQueryString('skip', skipAmount - 20) : pathname + '?' + createQueryString('skip', skipAmount)}>Back</Link>
        </div>
    )
}