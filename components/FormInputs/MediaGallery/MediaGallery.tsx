'use client'

import { FilePreview } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'react-feather'
import styles from './MediaGallery.module.css'
import upload from '@/app/api/upload'
import { PopupMessage, PopupMessageType } from '../../PopupMessage/PopupMessage'
import { UploadedImageRepresentation } from '../ImageDropzone/ImageDropzone'
import GalleryImage from './GalleryImage'

const MediaGallery = ({ onImagesUploaded, presetFiles }: { onImagesUploaded(files: UploadedImageRepresentation[]) : void, presetFiles?: string }) => {
    const [files, setFiles] = useState<UploadedImageRepresentation[]>([])
    const [rejected, setRejected] = useState<FileRejection[]>([])

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            acceptedFiles.forEach(file => {
                upload(file).then(url => {
                    if(url) {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `Uploaded ${file.name}`))
                        setFiles(previousFiles => [
                            ...previousFiles,
                            { url: url, name: file.name }
                        ])
                    }
                });
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                let message = `Uploading ${file.file.name} failed because `
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            message += ' file is not a valid image.';
                            break;
                        case 'file-too-large':
                            message += ' file is too large.';
                            break;
                        default:
                            message += ' unknown error.';
                            break;
                    }
                })
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, message))
            })
        }
    }, [])

    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: 1024 * 2000,
        maxFiles: 10,
        onDrop
    })

    useEffect(() => {
        if(presetFiles) {
            let files = JSON.parse(presetFiles) as UploadedImageRepresentation[]
            if(files && files.length > 0) {
                setFiles(files);
            }
        }
    }, [])

    useEffect(() => {
        // Revoke the data uris to avoid memory leaks
        if(files.length > 0)
            onImagesUploaded(files)
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

    const moveFile = (from: number, to: number) => {
        setFiles(prevFiles => {
            const newFiles = [...prevFiles]
            console.log('Moving', from, 'to', to)
            newFiles.splice(to, 0, newFiles.splice(from, 1)[0])
            return newFiles
        })
    }

    return (
        <>
            <div className={styles.gallery}>
                {files.map((file, idx) => {
                    return (
                        <GalleryImage key={idx} id={file.name} idx={idx} url={file.url} name={file.name} removeFile={removeFile} moveFile={moveFile} />
                    )
                })}
                <div {...getRootProps()} className={styles.upload}>
                    <input {...getInputProps({ name: 'file' })} />
                    <Plus />
                    <p>Drag and Drop here or click to upload images</p>
                </div>
            </div>
            <input type='hidden' name='files' value={JSON.stringify(files)} />
        </>
    )
}

export default MediaGallery