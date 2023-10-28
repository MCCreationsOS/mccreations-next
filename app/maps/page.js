'use client'
const fetch = require('node-fetch')

import ContentGrid from "@components/ContentGrid"
import ContentCard from "@components/ContentCard"
import Menu from "@components/Menu"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { getMapCount, getMaps } from "app/getData"
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
    const [pages, setPages] = useState(0)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    let page = (Number.parseInt(searchParams.get("page")));
    if(!page) {
        page = 0;
    }

    useEffect(() => {
        getPageCount();
        findMaps();
    }, [page])

    const findMaps = async () => {
        console.log("Searching with ")
        let m = await getMaps({sort: "newest", limit: 20, skip: (page * 20)})
        setMaps(m);
    }

    const getPageCount = async () => {
        let count = await getMapCount();
        setPages(Math.ceil(count / 20.0))
    }

    const createQueryString = useCallback(
        (name, value) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
      

      const goToPage = (page) => {
        return pathname + '?' + createQueryString('page', page)
      }
    
    return (
        <div>
            <Menu selectedPage='maps'></Menu>
                <div>
                    <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map}></ContentCard>)}></ContentGrid>
                </div>
                <div className="contentPageNavigator">
                    {(page != 0) ? <Link href={goToPage(0)}>First</Link> : <></>}
                    {(page != 0) ? <Link href={goToPage(page - 1)}>Back</Link> : <></>}
                    {(page - 3 >= 0) ? <Link href={goToPage(page - 3)}>{page - 2}</Link> : <Link href={goToPage(0)}>{1}</Link>}
                    {(page - 3 >= 0) ? <Link href={goToPage(page - 2)}>{page - 1}</Link> : <Link href={goToPage(1)}>{2}</Link>}
                    {(page - 3 >= 0) ? <Link href={goToPage(page - 1)}>{page}</Link> : <Link href={goToPage(2)}>{3}</Link>}
                    {(page - 3 >= 0) ? <Link href={goToPage(page)}>{page + 1}</Link> : <Link href={goToPage(3)}>{4}</Link>}
                    {(page + 3 <= pages) ? <Link href={goToPage(page + 1)}>{page + 2}</Link> : <Link href={goToPage(pages-3)}>{pages-3}</Link>}
                    {(page + 3 <= pages) ? <Link href={goToPage(page + 2)}>{page + 3}</Link> : <Link href={goToPage(pages-2)}>{pages-2}</Link>}
                    {(page + 3 <= pages) ? <Link href={goToPage(page + 3)}>{page + 4}</Link> : <Link href={goToPage(pages-1)}>{pages-1}</Link>}
                    {(page != pages -1) ? <Link href={goToPage(page + 1)}>Next</Link> : <></>}
                    {(page != pages -1) ? <Link href={goToPage(pages - 1)}>Last</Link> : <></>}
                </div>
        </div>
    )
}