'use client'

import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'lucide-react'
import upload from '@/app/api/upload'
import { useTranslations } from 'next-intl'
import { useToken } from '@/app/api/hooks/users'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { Button } from '../ui/button'
const FileDropzone = ({ onFilesUploaded, presetFile }: { presetImage?: string, onFilesUploaded(files: string) : void, presetFile?: string }) => {
    const [file, setFile] = useState<string>("")
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const {token} = useToken();
    const t = useTranslations()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            upload(acceptedFiles, token).then(uploadedFiles => {
                if(uploadedFiles) {
                    uploadedFiles.forEach(uploadedFile => {
                        // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Form.Shared.uploaded', { file: uploadedFile.name })))
                        toast.success(t('Components.Dropzone.uploaded', { file: uploadedFile.name }))
                        setFile(uploadedFile.location)
                    })
                    onFilesUploaded(uploadedFiles.map(file => file.location).join(','))
                }
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                let message = file.file.name
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            toast.error(t('Components.Dropzone.invalid_type', { type: t('Components.Dropzone.FileTypes.zip') }))
                            break;
                        case 'file-too-large':
                            toast.error(t('Components.Dropzone.file_too_large', { size: '2MB' }))
                            break;
                        default:
                            toast.error(t('Components.Dropzone.file_unknown'))
                            break;
                    }
                })
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/zip': ['.zip', '.mcworld', '.mcpack', '.mctemplate', '.mcaddon'],
        },
        maxFiles: 1,
        maxSize: 1024 * 101024,
        onDrop
    })

    useEffect(() => {
        if(presetFile) {
            setFile(presetFile);
        }
    }, [])

    useEffect(() => {
        if(file) {
            onFilesUploaded(file)
        }
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
                <p>{t('Components.Dropzone.or')}</p>
                <div className="mt-3 w-full">
                    <Label className="text-sm font-medium">{t('Components.Dropzone.link')}</Label>
                    <Input type="text" name="Link" id="Link" placeholder={t('Components.Dropzone.link_placeholder')} defaultValue={file} />
                    <Button variant="secondary" type="button" onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setFile((document.getElementById('Link') as HTMLInputElement).value || "")
                    }}><span>{t('Components.Dropzone.set_link')}</span></Button>
                </div>
            </div>
        </>
    )
}

export default FileDropzone