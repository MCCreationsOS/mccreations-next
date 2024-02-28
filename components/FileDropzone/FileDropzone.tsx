'use client'

import { FilePreview, MinecraftVersion } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { UploadCloud, X } from 'react-feather'
import styles from './FileDropzone.module.css'
import upload from '@/app/api/upload'
import FormComponent from '../Form/Form'
import { PopupMessage, PopupMessageType } from '../PopupMessage/PopupMessage'

const FileDropzone = ({ fileSet, presetFiles }: { presetImage?: string, fileSet(url: string, remove: boolean) : void, presetFiles?: File[] }) => {
    const [files, setFiles] = useState<File[]>([])
    const [rejected, setRejected] = useState<FileRejection[]>([])

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            console.log("Got a valid file")
            acceptedFiles.forEach(file => {
                upload(file).then(url => {
                    if(url) {
                        fileSet(url, false);
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `Uploaded ${file.name}`))
                    }
                });
            })
            setFiles(previousFiles => [
                ...previousFiles,
                ...acceptedFiles
            ])
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
            'application/zip': ['.zip']
        },
        onDrop
    })

    useEffect(() => {
        if(presetFiles)
        setFiles(presetFiles);
    }, [])

    const removeFile = (name: string) => {
        fileSet("https://mccreations.s3.us-west-1.amazonaws.com/" + name, true)
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
                        <Image className={styles.image_preview} src={"/defaultBanner.png"} width={1920} height={1080} alt=''></Image>
                        <div className={styles.image_overlay}>
                            <UploadCloud></UploadCloud>
                            {isDragActive ? (
                                <span>Drop it!</span>
                            ) : (
                                <span>Drag & drop a file here, or click to select a file</span>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <div className={styles.uploaded_files}>
                {files.map((file, idx) => {
                    return (
                        <div key={idx} className={styles.uploaded_file_wrapper}>
                            <div className={styles.uploaded_file_remove} onClick={() => {removeFile(file.name)}}> <X /> </div>
                            <FormComponent inputs={[
                                { name: "File", type: 'select', options: [{name: file.name}]},
                                { name: "Type", type: 'select', options: [{name: 'World', value: 'world'}, {name: 'Resourcepack', value: 'resourcepack'}, {name: "Datapack", value: 'datapack'}]},
                                { name: 'Minecraft Version', type: 'text' },
                                { name: "Content Version", type: 'text', value: "1.0"}
                                ]} onSave={() => {}} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default FileDropzone