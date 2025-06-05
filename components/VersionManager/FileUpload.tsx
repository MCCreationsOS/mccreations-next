'use client'

import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'lucide-react'
import styles from './FileDropzone.module.css'
import upload from '@/app/api/upload'
import { PopupMessage, PopupMessageType } from '../old/PopupMessage/PopupMessage'
import Text from '../old/FormInputs/Text'
import { useTranslations } from 'next-intl'
import { useToken } from '@/app/api/hooks/users'
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
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Form.Shared.uploaded', { file: uploadedFile.name })))
                        setFile(uploadedFile.location)
                    })
                    onFilesUploaded(uploadedFiles.map(file => file.location).join(','))
                }
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `${file.file.name}${t('Form.Files.invalid_file')}`))
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
        onFilesUploaded(file)
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
            <div  className={styles.upload}>
                <div {...getRootProps()} className={styles.dnd}>
                    <input {...getInputProps({ name: 'file' })} />
                    <Plus />
                    <p>{t('Form.Files.drop_zone')}</p>
                </div>
                <p>Or...</p>
                <div className={styles.dnd}>
                    <Text type="text" name="Link" placeholder="https://example.com/file.zip" value={file} />
                </div>
            </div>
        </>
    )
}

export default FileDropzone