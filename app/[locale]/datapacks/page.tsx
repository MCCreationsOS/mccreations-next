import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage"

const pathname = "/datapacks/"

export default async function Datapacks(
    props: {searchParams: Promise<{page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}>}
) {
    const searchParams = await props.searchParams;
    return <CreationSearchPage searchParams={searchParams} collectionName={CollectionNames.Datapacks} pathname={pathname}/>
}