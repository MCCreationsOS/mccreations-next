import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { getLanguage, getQueuedLanguage } from "@/app/api/translation";
import LanguageEditor from "./LanguageEditor";

export default async function Page({params}: {params: Params}) {
    const englishLanguage = JSON.stringify(await getLanguage("en-US"), null, 2);
    let editingLanguage = JSON.stringify(await getQueuedLanguage(params.lang), null, 2);
    if(!editingLanguage || editingLanguage === "null") {
        editingLanguage = englishLanguage.replace("en-US", params.lang)
    }
    
    return <LanguageEditor englishLanguage={englishLanguage} editingLanguage={editingLanguage} langKey={params.lang} />
}