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

export async function updateLanguage(locale: string, language: string) {
    let response = await fetch(`${process.env.DATA_URL}/translation/${locale}`, {
        method: "POST",
        body: language,
        cache: 'no-store'
    })
    let data = await response.json()
    return data
}