import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage"

const pathname = "/resourcepacks/"

export default async function Resourcepacks({searchParams}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}}) {
    return <CreationSearchPage searchParams={searchParams} collectionName={CollectionNames.Resourcepacks} pathname={pathname}/>
}