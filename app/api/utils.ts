export function makeSentenceCase(string: string) {
    if(!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function formatRating(rating: number, decimals: number = 2) {
    const scale = Math.pow(10, decimals);
    return parseFloat((Math.round(rating * 5 * scale) / scale).toFixed(decimals)).toString();
}
type Translator = {
    (key: string, values?: Record<string, string | number>): string
    has: (key: string) => boolean
}

/**
 * Display name for a tag. Built-in tags have translations; anything else (user-entered or
 * legacy tags) is shown as-is instead of making next-intl throw on a missing key.
 */
export function tagLabel(t: Translator, tag: string) {
    const key = `Components.Creations.Tags.${tag}`
    return tag && t.has(key) ? t(key) : makeSentenceCase(tag)
}
