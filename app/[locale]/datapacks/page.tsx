import { CollectionNames} from "@/app/api/types"
import ContentSearchPage from "@/components/Creations/Search/ContentSearchPage"

const pathname = "/datapacks/"

export default async function Datapacks({searchParams}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}}) {
    return <ContentSearchPage searchParams={searchParams} collectionName={CollectionNames.Datapacks} pathname={pathname}/>
}