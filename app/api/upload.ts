import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"

export default async function upload(files: File[], token: string): Promise<{type: string, name: string, location: string}[]> {
    return new Promise((resolve, reject) => {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`files`, file)
        })
        const xhr = new XMLHttpRequest()
        xhr.open('POST', `${process.env.DATA_URL}/upload`, true)
        xhr.setRequestHeader('Authorization', token)
        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `Uploading ${files.length} files`, () => {}, 99999999999))
        xhr.upload.onprogress = (event) => {
            PopupMessage.changeMessage(`${Math.round(event.loaded / event.total * 100)}% (${event.loaded} of ${event.total} bytes)`)
        }

        xhr.onload = () => {
            if(xhr.status === 200) {
                PopupMessage.clearMessage()
                const data = JSON.parse(xhr.responseText)
                resolve(data.files)
            } else {
                reject(new Error('Failed to upload files'))
            }

        }

        xhr.send(formData)
    })
}