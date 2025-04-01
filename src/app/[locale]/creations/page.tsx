import { CreationCard } from "@/components/creations/creation-card";
import { AutoPagination } from "@/components/pagination";
import { SearchBar } from "@/components/search-bar";
import { SearchFilters } from "@/components/search-filters";
import { Pagination } from "@/components/ui/pagination";
import { ContentType } from "@/lib/api";
import { searchCreations } from "@/lib/fetchers";
import { getTranslations } from "next-intl/server";

interface CreationsProps {
    searchParams: {
        status?: string;
        sort?: string;
        type?: "maps" | "datapacks" | "resourcepacks" | "marketplace" | "all" | "content";
        includeTags?: string;
        excludeTags?: string;
        minecraftVersion?: string;
        creators?: string;
        search?: string;
        page?: string;
        limit?: string;
    }
}

export default async function Creations({searchParams}: CreationsProps) {
    const t = await getTranslations();
    const params = await searchParams;

    return (
        <main className="py-8 px-4 md:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold">{t("Creations.title")}</h1>

                <div className="mb-8">
                    <SearchBar path="/creations" initialValue={params.search} />
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-64 flex-shrink-0">
                        <SearchFilters searchParams={params} path="/creations" />
                    </div>
                    <div className="flex-grow">
                        <CreationResults searchParams={searchParams} />
                    </div>
                </div>

            </div>
        </main>
    )
}

async function CreationResults({searchParams}: CreationsProps) {
    const t = await getTranslations();
    const params = await searchParams;

    const status = params.status ? parseInt(params.status) : undefined;
    const sort = params.sort;
    const type = params.type || "content";
    const includeTags = params.includeTags?.split(",");
    const excludeTags = params.excludeTags?.split(",");
    const minecraftVersion = params.minecraftVersion;
    const creators = params.creators?.split(",");
    const search = params.search;
    const page = parseInt(params.page || "1");
    const limit = parseInt(params.limit || "20");
    
    const creations = await searchCreations("", {
        status,
        sort,
        contentType: type,
        includeTags,
        excludeTags,
        version: minecraftVersion,
        creators,
        search,
        page: page - 1,
        limit
    })

    const totalPages = Math.ceil(creations.totalCount / limit);

    return (<>
        {creations.documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {creations.documents.map((creation) => (
                    <CreationCard key={creation._id} creation={creation} />
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500">
                {t("Creations.noResults")}
            </div>
        )}

        {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
                <AutoPagination totalPages={totalPages} currentPage={page} path="/creations" />
            </div>
        )}
    </>)
}
