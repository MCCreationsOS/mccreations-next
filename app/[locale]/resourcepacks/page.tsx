'use client'
import ContentGrid from "@/components/ContentGrid"
import ContentCard from "@/components/ContentSlideshow/ContentCard"
import Menu from "@/components/Menu/Menu"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link";
import { useEffect, useState } from "react"
import { useCallback } from "react"
import { Filter } from "react-feather"
import { CollectionNames, SortOptions, StatusOptions } from "../../api/types"
import SearchAndFilter from "@/components/SearchAndFilter"
import { searchContent } from "@/app/api/content"
import { AdsenseComponent } from "@/components/AdUnits/InContent"
import {useTranslations} from 'next-intl';
import SidebarFilters from "@/components/SearchAndFilter/SidebarFilters"

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

export default function Resourcepacks() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [resourcepacks, setResourcepacks] = useState([])
    const [pages, setPages] = useState(0)
    const [loading, setLoading] = useState(false)
    const t = useTranslations()
    let page = 0
    if(searchParams.get("page") != null) {
       page = (Number.parseInt(searchParams.get("page")!));
    }

    useEffect(() => {
        let search = ""
        let sort = SortOptions.Newest
        let status = StatusOptions.Approved
        let include: string = ""
        let exclude: string = ""
        if(searchParams.get("search") && searchParams.get("search") != search) {
            search = searchParams.get("search") + ""
        }
        if(searchParams.get("sort") && searchParams.get("sort") != sort) {
            sort = searchParams.get("sort")! as SortOptions
        }
        if(searchParams.get("status")&& Number.parseInt(searchParams.get("status")!) != status) {
            status = Number.parseInt(searchParams.get("status")!)
        }
        if(searchParams.get("include") && searchParams.get("include") != "") {
            include = searchParams.get("include")!
        }
        if(searchParams.get('exclude') && searchParams.get('exclude') != "") {
            exclude = searchParams.get('exclude')!
        }
        findResourcepacks(search, sort, status, include, exclude);
    }, [])

    useEffect(() => {
        let search = ""
        let sort = SortOptions.Newest
        let status = StatusOptions.Approved
        let include: string = ""
        let exclude: string = ""
        if(searchParams.get("search") && searchParams.get("search") != search) {
            search = searchParams.get("search") + ""
        }
        if(searchParams.get("sort") && searchParams.get("sort") != sort) {
            sort = searchParams.get("sort")! as SortOptions
        }
        if(searchParams.get("status")&& Number.parseInt(searchParams.get("status")!) != status) {
            status = Number.parseInt(searchParams.get("status")!)
        }
        if(searchParams.get("include") && searchParams.get("include") != "") {
            include = searchParams.get("include")!
        }
        if(searchParams.get('exclude') && searchParams.get('exclude') != "") {
            exclude = searchParams.get('exclude')!
        }
        findResourcepacks(search, sort, status, include, exclude);
    }, [page])

    const findResourcepacks = async (search: string, sort: SortOptions, status: StatusOptions, includeTags: string, excludeTags: string) => {
        setLoading(true)
        let m = await searchContent({contentType: CollectionNames.Resourcepacks, sort: sort, limit: 19, page: page, search: search, status: status, includeTags: includeTags, excludeTags: excludeTags}, false)
        setLoading(false);
        setResourcepacks(m.documents);
        setPages(Math.ceil(m.totalCount / 20.0))
    }


    const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )
      

      const goToPage = (page: number) => {
        return pathname + '?' + createQueryString('page', page.toString())
      }

    
    return (
        <div>
            <Menu selectedPage='resourcepacks'></Menu>
            <SearchAndFilter callback={findResourcepacks}  contentType={CollectionNames.Resourcepacks}/>
            { resourcepacks && resourcepacks.length !== 0 && (
                <div className="page_with_sidebar">
                    <SidebarFilters callback={findResourcepacks} contentType={CollectionNames.Resourcepacks} />
                    <ContentGrid content={resourcepacks} enableSelection={true} enableAds={true}></ContentGrid>
                </div>
            )}
            { !resourcepacks || resourcepacks.length === 0 && (
                <div className="no_comments">
                    <h2>{t('Content.resourcepacks_not_found')}</h2>
                </div>
            )}
            { resourcepacks && pages > 1  &&  (<div className="navigator">
                {(page != 0) ? <Link href={goToPage(0)}><img src="/chevs-left.svg"></img></Link> : <></>}
                {(page != 0) ? <Link href={goToPage(page - 1)}><img src="/chev-left.svg"></img></Link> : <></>}
                {(page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 3)}>{page - 2}</Link> : <Link className={page == pages-7 ? "current": ""} href={goToPage(pages-7)}>{pages - 6}</Link> : <Link className={page == 0 ? "current": ""} href={goToPage(0)}>{1}</Link>}
                {(pages > 1) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 2)}>{page - 1}</Link> : <Link className={page == pages-6 ? "current": ""} href={goToPage(pages-6)}>{pages - 5}</Link> : <Link className={page == 1 ? "current": ""} href={goToPage(1)}>{2}</Link>: <></>}
                {(pages > 2) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page - 1)}>{page}</Link> : <Link className={page == pages-5 ? "current": ""} href={goToPage(pages-5)}>{pages - 4}</Link> : <Link className={page == 2 ? "current": ""} href={goToPage(2)}>{3}</Link>: <></>}
                {(pages > 3) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link className="current" href={goToPage(page)}>{page + 1}</Link> : <Link className={page == pages-4 ? "current": ""} href={goToPage(pages-4)}>{pages - 3}</Link> : <Link className={page == 3 ? "current": ""} href={goToPage(3)}>{4}</Link>: <></>}
                {(pages > 4) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page +1)}>{page +2}</Link> : <Link className={page == pages-3 ? "current": ""} href={goToPage(pages-3)}>{pages - 2}</Link> : <Link className={page == 4 ? "current": ""} href={goToPage(4)}>{5}</Link>: <></>}
                {(pages > 5) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page +2)}>{page+3}</Link> : <Link className={page == pages-2 ? "current": ""} href={goToPage(pages-2)}>{pages - 1}</Link> : <Link className={page == 5 ? "current": ""} href={goToPage(5)}>{6}</Link>: <></>}
                {(pages > 6) ? (page - 3 >= 0) ? (page < pages - 4) ? <Link href={goToPage(page+3)}>{page + 4}</Link> : <Link className={page == pages-1 ? "current": ""} href={goToPage(pages-1)}>{pages}</Link> : <Link className={page == 6 ? "current": ""} href={goToPage(6)}>{7}</Link>: <></>}
                {(pages > 1) ? (page != pages -1) ? <Link href={goToPage(page + 1)}><img src="/chev-right.svg"></img></Link> : <></>: <></>}
                {(pages > 6) ? (page != pages -1) ? <Link href={goToPage(pages - 1)}><img src="/chevs-right.svg"></img></Link> : <></>: <></>}
            </div>) }
               
            <AdsenseComponent adSlot={"3283646290"} adClient={"ca-pub-5425604215170333"} adFormat={"auto"} adLayout={undefined} width={"1000px"} height={"100px"}/>
        </div>
    )
}