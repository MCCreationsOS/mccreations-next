import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage"

const pathname = "/datapacks/"

export default async function Datapacks({searchParams}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}}) {
    return <CreationSearchPage searchParams={searchParams} collectionName={CollectionNames.Datapacks} pathname={pathname}/>
}