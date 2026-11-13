export async function getLanguage(locale: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/translation/${locale}`, {next: {revalidate: 60 * 60 * 24}})
        let data = await response.json()
        return data
    } catch (error) {
        console.error(error)
        let localLang = await import(`../../locales/${locale}.json`)
        // console.log(JSON.stringify(localLang))
        return JSON.parse(JSON.stringify(localLang))
    }
}

/** @returns {error} when saving fails */
export async function updateLanguage(locale: string, language: string): Promise<{ error?: string }> {
    try {
        const response = await fetch(`${process.env.DATA_URL}/translation/${encodeURIComponent(locale)}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: language,
            cache: 'no-store'
        })
        if (response.ok) return {}
        let error = `Request failed (${response.status})`
        try { error = (await response.json()).error ?? error } catch {}
        return { error }
    } catch (e) {
        return { error: String(e) }
    }
}
