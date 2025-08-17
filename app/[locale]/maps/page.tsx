import { CollectionNames} from "@/app/api/types"
import CreationSearchPage from "@/components/Creations/Search/CreationSearchPage";

const pathname = "/maps/"

export default async function Maps(
    props: {searchParams: Promise<{page: string, search: string, sort: string, status: string, includeTags: string, excludeTags: string}>, params: Promise<{locale: string}>}
) {
    const {locale} = await props.params;
    return <CreationSearchPage searchParams={props.searchParams} collectionName={CollectionNames.Maps} pathname={pathname} locale={locale}/>
}