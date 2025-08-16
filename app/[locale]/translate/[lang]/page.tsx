import { getLanguage, getQueuedLanguage } from "@/app/api/translation";
import LanguageEditor from "./LanguageEditor";

export default async function Page(props: {params: Promise<{locale: string, lang: string}>}) {
    const params = await props.params;
    const englishLanguage = JSON.stringify(await getLanguage("en-US"), null, 2);
    let editingLanguage = JSON.stringify(await getQueuedLanguage(params.lang), null, 2);
    if(!editingLanguage || editingLanguage === "null") {
        editingLanguage = englishLanguage.replace("en-US", params.lang)
    }

    return <LanguageEditor englishLanguage={englishLanguage} editingLanguage={editingLanguage} langKey={params.lang} />
}