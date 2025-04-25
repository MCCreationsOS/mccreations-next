import { CollectionNames} from "@/app/api/types"
import ContentSearchPage from "@/components/Creations/Search/ContentSearchPage"

const pathname = "/resourcepacks/"

export default async function Resourcepacks({searchParams}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}}) {
    return <ContentSearchPage searchParams={searchParams} collectionName={CollectionNames.Resourcepacks} pathname={pathname}/>
}