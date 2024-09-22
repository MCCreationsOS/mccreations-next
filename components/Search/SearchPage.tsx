"use client"

import { convertToCollection, searchContent } from "@/app/api/content"
import { Link, usePathname } from "@/app/api/navigation"
import { CollectionNames, ContentTypes, IContentDoc, SortOptions, StatusOptions } from "@/app/api/types"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import Menu from "../Menu/Menu"
import SearchAndFilter from "../SearchAndFilter"
import ContentGrid from "../ContentGrid"
import { AdsenseComponent } from "../AdUnits/InContent"

export default function SearchPage({defaultContent, contentType, sort, status, include, exclude, search}: {defaultContent: IContentDoc[], contentType: ContentTypes, sort: SortOptions, status: StatusOptions, include: string, exclude: string, search: string}) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [content, setContent] = useState(defaultContent)
    const [loading, setLoading] = useState(true)
    const [pages, setPages] = useState(0)
    const t = useTranslations()
    let page = 0
    if(searchParams.get("page") != null) {
       page = (Number.parseInt(searchParams.get("page")!));
    }

    useEffect(() => {
        if(searchParams.get("search") && searchParams.get("search") != search) {
            search = searchParams.get("search") + " " + search
        }
        findContent()
        
    }, [])

    useEffect(() => {
        if(searchParams.get("search") && searchParams.get("search") != search) {
            search = searchParams.get("search") + " " + search
        }
        findContent()
    }, [page])

    
    const findResourcepacks = async (search: string, sort: SortOptions, status: StatusOptions, includeTags: string, excludeTags: string) => {
        let m = await searchContent({contentType: CollectionNames.Resourcepacks, sort: sort, limit: 19, page: page, search: search, status: status, includeTags: includeTags, excludeTags: excludeTags}, false)
        setContent(m.documents);
        setLoading(false)
        setPages(Math.ceil(m.totalCount / 20.0))
    }
    
    const findMaps = async (search: string, sort: SortOptions, status: StatusOptions, includeTags: string, excludeTags: string) => {
        let m = await searchContent({contentType: CollectionNames.Maps, sort: sort, limit: 19, page: page, search: search, status: status, includeTags: includeTags, excludeTags: excludeTags}, false)
        setContent(m.documents);
        setPages(Math.ceil(m.totalCount / 20.0))
        setLoading(false)
    }
    
    const findDatapacks = async (search: string, sort: SortOptions, status: StatusOptions, includeTags: string, excludeTags: string) => {
        let m = await searchContent({contentType: CollectionNames.Datapacks, sort: sort, limit: 19, page: page, search: search, status: status, includeTags: includeTags, excludeTags: excludeTags}, false)
        setContent(m.documents);
        setPages(Math.ceil(m.totalCount / 20.0))
        setLoading(false)
    }
    
    const findContent = async () => {
        switch(contentType) {
            case ContentTypes.Resourcepacks:
                findResourcepacks(search, sort, status, include, exclude);
                break;
            case ContentTypes.Maps:
                findMaps(search, sort, status, include, exclude);
                break;
            case ContentTypes.Datapacks:
                findDatapacks(search, sort, status, include, exclude);
                break;
            case ContentTypes.Maps + "s":
                findMaps(search, sort, status, include, exclude);
                break;
            case ContentTypes.Datapacks + "s":
                findDatapacks(search, sort, status, include, exclude);
                break;
            case ContentTypes.Resourcepacks + "s":
                findResourcepacks(search, sort, status, include, exclude);
                break;
        }
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
            { content && content.length !== 0 && (
                <div>
                <ContentGrid enableAds={!loading} content={content} linkTo={convertToCollection(contentType)} enableSelection={true} ></ContentGrid>
            </div>
            )}
            { !content || content.length === 0 && (
                <div className="no_comments">
                    <h2>{t(`Content.${contentType}s_not_found`)}</h2>
                </div>
            )}
            { content && pages > 1  &&  (<div className="navigator">
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