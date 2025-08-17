import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage"

const pathname = "/datapacks/"

export default async function Datapacks(
    props: {searchParams: Promise<{page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}>, params: Promise<{locale: string}>}
) {
    const {locale} = await props.params;
    return <CreationSearchPage searchParams={props.searchParams} collectionName={CollectionNames.Datapacks} pathname={pathname} locale={locale}/>
}