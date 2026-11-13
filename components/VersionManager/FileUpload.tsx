'use client'

import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToken } from '@/app/api/hooks/users'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Uploader } from '@/app/api/upload'
import { Progress } from '../ui/progress'
/** Matches the API's per-file upload limit */
const MAX_FILE_SIZE_MB = 30

const FileDropzone = ({ forWhat, onFilesUploaded, presetFile }: { forWhat: string, presetImage?: string, onFilesUploaded(files: string) : void, presetFile?: string }) => {
    const [file, setFile] = useState<string>(presetFile ?? "")
    const [link, setLink] = useState<string>(presetFile ?? "")
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const [progress, setProgress] = useState<number>(100)
    const {token} = useToken();
    const t = useTranslations()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            const uploader = new Uploader(acceptedFiles, token, forWhat)
            uploader.onProgress = (progress: number) => {
                setProgress(progress)
            }
            uploader.onComplete = (uploadedFiles: {type: string, name: string, location: string}[]) => {
                setProgress(100)
                if (uploadedFiles[0]) {
                    setFile(uploadedFiles[0].location)
                    setLink(uploadedFiles[0].location)
                }
            }
            uploader.onError = (error: Error) => {
                setProgress(100)
                toast.error(error.message || t('Components.Dropzone.upload_failed'))
            }
            setProgress(0)
            uploader.upload().catch(() => { /* reported through onError */ })
            // upload(acceptedFiles, token, forWhat).then(uploadedFiles => {
            //     if(uploadedFiles) {
            //         uploadedFiles.forEach(uploadedFile => {
            //             // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Form.Shared.uploaded', { file: uploadedFile.name })))
            //             toast.success(t('Components.Dropzone.uploaded', { file: uploadedFile.name }))
            //             setFile(uploadedFile.location)
            //         })
            //         onFilesUploaded(uploadedFiles.map(file => file.location).join(','))
            //     }
            // })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                let message = file.file.name + " - "
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            toast.error(t('Components.Dropzone.invalid_type', { type: t('Components.Dropzone.FileTypes.zip') }))
                            break;
                        case 'file-too-large':
                            toast.error(t('Components.Dropzone.file_too_large', { max_size: `${MAX_FILE_SIZE_MB}MB` }))
                            break;
                        default:
                            toast.error(t('Components.Dropzone.file_unknown'))
                            break;
                    }
                })
            })
        }
    }, [token, forWhat, t])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/zip': ['.zip', '.mcworld', '.mcpack', '.mctemplate', '.mcaddon'],
        },
        maxFiles: 1,
        maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
        onDrop
    })

    // Report each new file exactly once (the preset doesn't count as new)
    useEffect(() => {
        if(file && file !== presetFile) {
            onFilesUploaded(file)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file])

    const removeFile = (name: string) => {
        setFile("")
    }

    const removeAll = () => {
        setFile("")
        setRejected([])
    }

    const removeRejected = (name: string) => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <div {...getRootProps()} className="flex flex-col items-center justify-center p-10 mb-3 border border-dashed border-gray-300 w-full">
                    <input {...getInputProps({ name: 'file' })} />
                    <Plus />
                    <p>{t('Components.Dropzone.dropzone')}</p>
                </div>
                {progress !== 100 && <Progress value={progress} />}
                <p>{t('Components.Dropzone.or')}</p>
                <div className="mt-3 w-full">
                    <Label className="text-sm font-medium">{t('Components.Dropzone.link')}</Label>
                    <Input type="url" name="Link" id="Link" placeholder={t('Components.Dropzone.link_placeholder')} value={link} onChange={(e) => setLink(e.target.value)} onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            setFile(link.trim())
                        }
                    }} />
                    <Button variant="secondary" type="button" onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setFile(link.trim())
                    }}><span>{t('Components.Dropzone.set_link')}</span></Button>
                </div>
            </div>
        </>
    )
}

export default FileDropzone