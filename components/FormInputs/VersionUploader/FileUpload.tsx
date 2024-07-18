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
import { useI18n } from '@/locales/client'

const FileDropzone = ({ onFilesUploaded, presetFile }: { presetImage?: string, onFilesUploaded(files: string) : void, presetFile?: string }) => {
    const [file, setFile] = useState<string>("")
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const t = useI18n();

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            acceptedFiles.forEach(file => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `${file.name}${t('form.versions.uploading')}`))
                upload(file, "files").then(url => {
                    if(url) {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `${file.name}${t('form.versions.uploaded')}`))
                        setFile(url)
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `${file.name}${t('form.versions.upload_failed')}`))
                    }
                });
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `${file.file.name}${t('form.versions.invalid_file')}`))
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/zip': ['.zip'],
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
                    <p>{t('form.versions.drop_zone')}</p>
                </div>
                <p>Or...</p>
                <div className={styles.dnd}>
                    <FormComponent id={"linkFile" + Math.floor(Math.random() * 1000)} onSave={(inputs) => {
                        let url = inputs[0]
                        if(url) {
                            setFile(url)
                        }
                    }} options={{useSaveButton: false}}>
                        <Text type="text" name="Link" placeholder="https://example.com/file.zip" value={file} />    
                    </FormComponent>
                </div>
            </div>
        </>
    )
}

export default FileDropzone