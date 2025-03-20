import { CollectionNames} from "@/app/api/types"
import ContentSearchPage from "@/components/Content/Search/ContentSearchPage";

const pathname = "/maps/"

export default async function Maps({searchParams}: {searchParams: {page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}}) {
    return <ContentSearchPage searchParams={searchParams} collectionName={CollectionNames.Maps} pathname={pathname}/>
}