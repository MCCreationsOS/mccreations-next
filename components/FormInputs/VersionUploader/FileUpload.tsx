'use client'

import { FilePreview, IFile, MinecraftVersion } from '@/app/api/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'react-feather'
import styles from './FileDropzone.module.css'
import upload from '@/app/api/upload'
import FormComponent from '../../Form/Form'
import { PopupMessage, PopupMessageType } from '../../PopupMessage/PopupMessage'
import Text from '../Text'
import { useTranslations } from 'next-intl'

const FileDropzone = ({ onFilesUploaded, presetFile }: { presetImage?: string, onFilesUploaded(files: string) : void, presetFile?: string }) => {
    const [file, setFile] = useState<string>("")
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const t = useTranslations()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            acceptedFiles.forEach(file => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Form.Shared.uploading', { file: file.name })))
                upload(file, "files").then(url => {
                    if(url) {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Form.Shared.uploaded', { file: file.name })))
                        setFile(url)
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Form.Shared.upload_failed', { file: file.name })))
                    }
                });
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