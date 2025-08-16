import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage"

const pathname = "/resourcepacks/"

export default async function Resourcepacks(
    props: {searchParams: Promise<{page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}>}
) {
    const searchParams = await props.searchParams;
    return <CreationSearchPage searchParams={searchParams} collectionName={CollectionNames.Resourcepacks} pathname={pathname}/>
}