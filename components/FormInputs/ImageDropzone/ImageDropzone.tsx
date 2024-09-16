'use client'

import { FilePreview } from '@/app/api/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { UploadCloud } from 'react-feather'
import styles from './ImageDropzone.module.css'
import upload from '@/app/api/upload'
import { PopupMessage, PopupMessageType } from '../../PopupMessage/PopupMessage'
import { useTranslations } from 'next-intl'

/**
 * The representation of an uploaded image
 * @param name The name of the image
 * @param url The url of the image
 */
export interface UploadedImageRepresentation {
    name: string,
    url: string
}

/**
 * A dropzone for images, uses react-dropzone
 * @param presetImage The preset image to display
 * @param onImagesUploaded The function to call when images are uploaded
 * @param allowMultiple Whether or not the dropzone should allow multiple images to be uploaded
 * @param presetFiles The preset files to display
 */
const ImageDropzone = ({ presetImage, onImagesUploaded, allowMultiple, presetFiles }: { presetImage?: string, onImagesUploaded(files: UploadedImageRepresentation[]) : void, allowMultiple: boolean, presetFiles?: string }) => {
    const [files, setFiles] = useState<UploadedImageRepresentation[]>([])
    // Reject files are collected, although not technically displayed
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const t = useTranslations()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            acceptedFiles.forEach(file => {
                // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `${t('form.images.uploading')}${file.name}`))
                upload(file, "images").then(url => {
                    if(url) {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Form.Shared.uploaded', {file: file.name})))
                        
                        if(allowMultiple) {
                            // Send uploaded files to the parent component, then update the internal state of images
                            onImagesUploaded([
                                ...files,
                                ...acceptedFiles.map(file =>
                                    {return { url: url, name: file.name }}
                                )
                            ]);
                            setFiles(previousFiles => [
                                ...previousFiles,
                                ...acceptedFiles.map(file =>
                                    {return { url: url, name: file.name }}
                                )
                            ])
                        } else {
                            onImagesUploaded([
                                ...acceptedFiles.map(file =>
                                    {return { url: url, name: file.name }}
                                )
                            ]);
                            setFiles([
                                ...acceptedFiles.map(file =>
                                    {return { url: url, name: file.name }}
                                )
                            ])
                        }
                    }
                });
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                let message = file.file.name
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            message += t('Form.Images.invalid');
                            break;
                        case 'file-too-large':
                            message += t('Form.Images.too_large');
                            break;
                        default:
                            message += t('Form.Images.unknown_error');
                            break;
                    }
                })
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, message))
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
        if(presetFiles) {
            let files = JSON.parse(presetFiles) as UploadedImageRepresentation[]
            if(files && files.length > 0) {
                setFiles(files);
            }
        }
    }, [])

    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.name !== name))
        onImagesUploaded(files.filter(file => file.name !== name));
    }

    const removeAll = () => {
        setFiles([])
        setRejected([])
    }

    const removeRejected = (name: string) => {
        setRejected(files => files.filter(({ file }) => file.name !== name))
    }

    return (
        <>
            <form>
                <div {...getRootProps()}>
                    <input {...getInputProps({ name: 'file' })} />
                    <div className={styles.single_dropzone}>
                        <Image className={styles.image_preview} src={(files[files.length - 1] && files[files.length - 1].url) ? files[files.length - 1].url : "/defaultBanner.png"} width={1920} height={1080} alt=''></Image>
                        <div className={styles.image_overlay}>
                            <UploadCloud></UploadCloud>
                            {isDragActive ? (
                                <span>{t('Form.Images.hovering_drop')}</span>
                            ) : (
                                <span>{t('Form.Images.drop_zone')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            {(allowMultiple) ? <div className={styles.uploaded_images}>
                {files.map((file, idx) => {
                    return (
                        <div key={idx} className={styles.uploaded_image_wrapper} onClick={(e) => {removeFile(file.name)}}>
                            <Image className={styles.uploaded_image} src={(file.url) ? file.url : (presetImage) ? presetImage : ""} width={150} height={150} alt={`${file.url.substring(file.url.lastIndexOf('/') + 1)}`}></Image>
                        </div>
                    )
                })}
            </div> : <></>}
        </>
    )
}

export default ImageDropzone