import ContentGrid from "@/components/ContentGrid"
import Menu from "@/components/Menu/Menu"
import { useSearchParams, usePathname } from "next/navigation"
import Link from "next/link";
import { fetchTags, searchContent } from "@/app/api/content"
import SearchAndFilter from "@/components/SearchAndFilter"
import {useTranslations} from 'next-intl';
import { AdsenseComponent } from "@/components/AdUnits/InContent"
import SidebarFilters from "@/components/SearchAndFilter/SidebarFilters"
import { getTranslations } from "next-intl/server";
import { CollectionNames, SortOptions, StatusOptions } from "@/app/api/types";

export default async function ContentSearchPage({searchParams, contentType, pathname}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}, contentType: CollectionNames, pathname: string}) {
    const t = await getTranslations()
    let page = 0
    if(searchParams.page != null && searchParams.page.length > 0) {
       page = (Number.parseInt(searchParams.page));
    }
    let search = searchParams.search ?? ""
    let sort = searchParams.sort ? searchParams.sort as SortOptions : SortOptions.Newest
    let status = searchParams.status ? Number.parseInt(searchParams.status) : StatusOptions.Approved
    let includeTags = searchParams.includeTags ?? ""
    let excludeTags = searchParams.excludeTags ?? ""

    let documents = await searchContent({contentType: contentType, sort: sort, limit: 19, page: page, search: search, status: status, includeTags: includeTags, excludeTags: excludeTags}, false)
    let pages = Math.ceil(documents.totalCount / 20.0)
    let creations = documents.documents

    let tags = await fetchTags(contentType)

    const createQueryString = (name: string, value: string) => {
          const params = new URLSearchParams(searchParams)
          params.set(name, value)
     
          return params.toString()
        }
      

      const goToPage = (page: number) => {
        return pathname + '?' + createQueryString('page', page.toString())
      }

    
    return (
        <div>
            <Menu selectedPage={pathname.replace("/", "")}></Menu>
            <SearchAndFilter contentType={contentType} tags={tags}/>
            { creations && creations.length !== 0 && (
                <div className="page_with_sidebar">
                    <SidebarFilters contentType={contentType} />
                    <ContentGrid content={creations} enableSelection={true} enableAds={true}></ContentGrid>
                </div>
            )}
            { !creations || creations.length === 0 && (
                <div className="no_comments">
                    <h2>{t('Content.maps_not_found')}</h2>
                </div>
            )}
            { creations && pages > 1 &&  (<div className="navigator">
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