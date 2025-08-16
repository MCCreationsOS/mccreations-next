import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage";

const pathname = "/maps/"

export default async function Maps(
    props: {searchParams: Promise<{page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}>}
) {
    return <CreationSearchPage searchParams={props.searchParams} collectionName={CollectionNames.Maps} pathname={pathname}/>
}