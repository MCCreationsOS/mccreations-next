'use client'

import { FilePreview } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { UploadCloud } from 'react-feather'
import styles from './ImageDropzone.module.css'
import upload from '@/app/api/upload'
import { PopupMessage, PopupMessageType } from '../PopupMessage/PopupMessage'

const ImageDropzone = ({ presetImage, imageSet, allowMultiple, presetFiles }: { presetImage?: string, imageSet(url: string, files?: FilePreview[]) : void, allowMultiple: boolean, presetFiles?: FilePreview[] }) => {
    const [files, setFiles] = useState<FilePreview[]>([])
    const [rejected, setRejected] = useState<FileRejection[]>([])

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            acceptedFiles.forEach(file => {
                upload(file).then(url => {
                    if(url) {
                        imageSet(url, files);
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `Uploaded ${file.name}`))
                    }
                });
            })
            if(allowMultiple) {
                setFiles(previousFiles => [
                    ...previousFiles,
                    ...acceptedFiles.map(file =>
                        {return { preview: URL.createObjectURL(file), file: file, name: file.name }}
                    )
                ])
            } else {
                setFiles([
                    ...acceptedFiles.map(file =>
                        {return { preview: URL.createObjectURL(file), file: file, name: file.name }}
                    )
                ])
            }
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `${file.file.name} is not a valid image`))
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: 1024 * 1000,
        maxFiles: (allowMultiple) ? 10 : 1,
        onDrop
    })

    useEffect(() => {
        if(presetFiles)
        setFiles(presetFiles);
    }, [])

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        return () => files.forEach(file => URL.revokeObjectURL(file.preview!))
    }, [files])

    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.name !== name))
    }

    const removeAll = () => {
        setFiles([])
        setRejected([])
    }

    const removeRejected = (name: string) => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    async function action() {
        const file = files[0]
        if (!file) return
        // get a signature using server action

    }

    return (
        <>
            <form onSubmit={action}>
                <div {...getRootProps()}>
                    <input {...getInputProps({ name: 'file' })} />
                    <div className={styles.single_dropzone}>
                        <Image className={styles.image_preview} src={(files[files.length-1] && files[files.length-1].preview) ? files[files.length-1].preview! : (presetImage) ? presetImage : ""} width={1920} height={1080} alt=''></Image>
                        <div className={styles.image_overlay}>
                            <UploadCloud></UploadCloud>
                            {isDragActive ? (
                                <span>Drop it!</span>
                            ) : (
                                <span>Drag & drop an image here, or click to select an image</span>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            {(allowMultiple) ? <div className={styles.uploaded_images}>
                {files.map((file, idx) => {
                    return (
                        <div key={idx} className={styles.uploaded_image_wrapper} onClick={(e) => {removeFile(file.name)}}>
                            <Image className={styles.uploaded_image} src={(file.preview) ? file.preview : (presetImage) ? presetImage : ""} width={150} height={150} alt={`Uploaded Image ${idx}`}></Image>
                        </div>
                    )
                })}
            </div> : <></>}
        </>
    )
}

export default ImageDropzone