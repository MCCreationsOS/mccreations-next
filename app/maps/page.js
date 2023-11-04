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
import { Filter } from "react-feather"
import Loading from "./loading"

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
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [maps, setMaps] = useState([])
    const [pages, setPages] = useState(0)
    const [filtering, setFiltering] = useState(false);
    const [search, setSearch] = useState(searchParams.get("search"))
    let page = (Number.parseInt(searchParams.get("page")));
    if(!page || page > pages) {
        page = 0;
    }

    useEffect(() => {
        getPageCount();
        findMaps();
    }, [page, search])

    const findMaps = async () => {
        let m = await getMaps({sort: "newest", limit: 20, skip: (page * 20), search: search})
        setMaps(m);
    }

    const getPageCount = async () => {
        let count = await getMapCount({sort: "newest", limit: 20, skip: (page * 20), search: search});
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

      if(maps.length == 0) {
        return (
            <Loading />
        )
      }
    
    return (
        <div>
            <Menu selectedPage='maps'></Menu>
            <div className="searchAndFilter">
                <div className="searchStack">
                    <input type="text" placeholder="Search" className="search" onChange={(e) => {setSearch(e.target.value); goToPage(0);}}></input>
                    <button className="buttonSecondary" onClick={() => setFiltering(!filtering)}><Filter /></button>
                </div>
                <div className="filters" style={{display: (filtering) ? "block": "none"}}>
                    {/* Sort: <select>
                        <option value={"newest"}>Newest</option>
                        <option value={"updated"}>Updated</option>
                        <option value={"oldest"}>Oldest</option>
                        <option value={"title_ascending"}>Title Ascending</option>
                        <option value={"title_descending"}>Title Descending</option>
                        <option value={"highest_rated"}>Highest Rated</option>
                        <option value={"lowest_rated"}>Lowest Rated</option>
                    </select> */}
                    Coming Soon :p
                </div>
            </div>
                <div>
                    <ContentGrid content={maps.map(map => <ContentCard key={map.mapId} content={map} priority={true}></ContentCard>)}></ContentGrid>
                </div>
                <div className="contentPageNavigator">
                    {(page != 0) ? <Link href={goToPage(0)}><div className="imageBumper"></div><img src="/chevs-left.svg"></img></Link> : <></>}
                    {(page != 0) ? <Link href={goToPage(page - 1)}><div className="imageBumper"></div><img src="/chev-left.svg"></img></Link> : <></>}
                    {(page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 3)}>{page - 2}</Link> : <Link className={page == pages-7 ? "current": ""} href={goToPage(pages-7)}>{pages - 6}</Link> : <Link className={page == 0 ? "current": ""} href={goToPage(0)}>{1}</Link>}
                    {(pages > 1) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 2)}>{page - 1}</Link> : <Link className={page == pages-6 ? "current": ""} href={goToPage(pages-6)}>{pages - 5}</Link> : <Link className={page == 1 ? "current": ""} href={goToPage(1)}>{2}</Link>: <></>}
                    {(pages > 2) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 1)}>{page}</Link> : <Link className={page == pages-5 ? "current": ""} href={goToPage(pages-5)}>{pages - 4}</Link> : <Link className={page == 2 ? "current": ""} href={goToPage(2)}>{3}</Link>: <></>}
                    {(pages > 3) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link className="current" href={goToPage(page)}>{page + 1}</Link> : <Link className={page == pages-4 ? "current": ""} href={goToPage(pages-4)}>{pages - 3}</Link> : <Link className={page == 3 ? "current": ""} href={goToPage(3)}>{4}</Link>: <></>}
                    {(pages > 4) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page +1)}>{page +2}</Link> : <Link className={page == pages-3 ? "current": ""} href={goToPage(pages-3)}>{pages - 2}</Link> : <Link className={page == 4 ? "current": ""} href={goToPage(4)}>{5}</Link>: <></>}
                    {(pages > 5) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page +2)}>{page+3}</Link> : <Link className={page == pages-2 ? "current": ""} href={goToPage(pages-2)}>{pages - 1}</Link> : <Link className={page == 5 ? "current": ""} href={goToPage(5)}>{6}</Link>: <></>}
                    {(pages > 6) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page+3)}>{page + 4}</Link> : <Link className={page == pages-1 ? "current": ""} href={goToPage(pages-1)}>{pages}</Link> : <Link className={page == 6 ? "current": ""} href={goToPage(6)}>{7}</Link>: <></>}
                    {(pages > 1) ? (page != pages -1) ? <Link href={goToPage(page + 1)}><div className="imageBumper"></div><img src="/chev-right.svg"></img></Link> : <></>: <></>}
                    {(pages > 6) ? (page != pages -1) ? <Link href={goToPage(pages - 1)}><div className="imageBumper"></div><img src="/chevs-right.svg"></img></Link> : <></>: <></>}
                </div>
        </div>
    )
}