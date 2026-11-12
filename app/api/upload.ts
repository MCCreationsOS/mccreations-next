export class Uploader {
    private files: File[]
    private token: string
    private forWhat: string
    public onProgress: (progress: number) => void = () => {}
    public onComplete: (files: {type: string, name: string, location: string}[]) => void = () => {}
    public onError: (error: Error) => void = () => {}

    constructor(files: File[], token: string, forWhat: string) {
        this.files = files
        this.token = token
        this.forWhat = forWhat
    }

    public upload() {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            // forWhat must come before the files: the API streams parts in order and needs it to pick the storage path
            formData.append('forWhat', this.forWhat)
            this.files.forEach((file) => {
                formData.append(`files`, file)
            })
            const xhr = new XMLHttpRequest()
            xhr.open('POST', `${process.env.DATA_URL}/upload`, true)
            xhr.setRequestHeader('Authorization', this.token)
            xhr.upload.onprogress = (event) => {
                this.onProgress(Math.round(event.loaded / event.total * 100))
            }
    
            xhr.onload = () => {
                if(xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText)
                    this.onComplete(data.files)
                    resolve(data.files)
                } else {
                    this.onError(new Error('Failed to upload files'))
                    reject(new Error('Failed to upload files'))
                }
    
            }

            xhr.onerror = () => {
                this.onError(new Error('Failed to upload files'))
                reject(new Error('Failed to upload files'))
            }
    
            xhr.send(formData)
        })
    }
}