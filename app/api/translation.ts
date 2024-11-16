export async function getLanguage(locale: string) {
    try {
        let response = await fetch(`${process.env.DATA_URL}/translation/${locale}`)
        let data = await response.json()
        return data
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function getLanguageList() {
    let response = await fetch(`${process.env.DATA_URL}/translations`)
    let data = await response.json()
    return data
}

export async function updateLanguage(locale: string, language: string) {
    let response = await fetch(`${process.env.DATA_URL}/translation/${locale}`, {
        method: "PUT",
        body: language,
        cache: 'no-store'
    })
    let data = await response.json()
    return data
}

export async function approveLanguage(locale: string) {
    await fetch(`${process.env.DATA_URL}/translation/${locale}/approve`, {
        method: "PUT",
            cache: 'no-store'
    })
}

export async function getQueuedLanguage(locale: string) {
    let response = await fetch(`${process.env.DATA_URL}/translation/${locale}_queue`)
    if (response.status === 200) {
        let data = await response.json()
        return data
    } else {
        response = await fetch(`${process.env.DATA_URL}/translation/${locale}`)
        let data = await response.json()
        return data
    }
}