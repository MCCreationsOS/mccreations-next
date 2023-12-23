'use client'

import { FilePreview } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { UploadCloud } from 'react-feather'
import styles from './SingleImageDropzone.module.css'
import upload from '@/app/api/upload'

const SingleDropzone = ({ presetImage, imageSet }: { presetImage?: string, imageSet(url: string) : void }) => {
    const [files, setFiles] = useState<FilePreview[]>([])
    const [rejected, setRejected] = useState<FileRejection[]>([])

    const onDrop = useCallback((acceptedFiles: FilePreview[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            upload(acceptedFiles[0]).then(url => {
                console.log("Got URL " + url)
                if(url) {
                    imageSet(url);
                }
            });
            setFiles(previousFiles => [
                // If allowing multiple files
                // ...previousFiles,
                ...acceptedFiles.map(file =>
                    Object.assign(file, { preview: URL.createObjectURL(file) })
                )
            ])
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: 1024 * 1000,
        maxFiles: 1,
        onDrop
    })

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
        console.log("Form Submitted")

    }

    return (
        <>
            <form onSubmit={action}>
                <div {...getRootProps()}>
                    <input {...getInputProps({ name: 'file' })} />
                    <div className={styles.single_dropzone}>
                        <Image className={styles.image_preview} src={(files[0] && files[0].preview) ? `${files[0].preview}` : `${presetImage}`} width={1920} height={1080} alt=''></Image>
                        {<UploadCloud></UploadCloud>}
                        {isDragActive ? (
                            <span>Drop it!</span>
                        ) : (
                            <span>Drag & drop an image here, or click to select an image</span>
                        )}
                    </div>
                </div>
            </form>
        </>
    )
}

export default SingleDropzone