export function makeSentenceCase(string: string) {
    if(!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function formatRating(rating: number, decimals: number = 2) {
    const scale = Math.pow(10, decimals);
    return parseFloat((Math.round(rating * 5 * scale) / scale).toFixed(decimals)).toString();
}