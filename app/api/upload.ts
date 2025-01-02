
export default async function upload(files: File[], token: string): Promise<{type: string, name: string, location: string}[]> {
    const formData = new FormData()
    files.forEach((file, index) => {
        formData.append(`files`, file)
    })
    const response = await fetch(`${process.env.DATA_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': token
        }
    })
    let data = await response.json()
    console.log(data)
    return data.files
}