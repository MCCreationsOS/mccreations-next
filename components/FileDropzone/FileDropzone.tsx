'use client'

import { FilePreview, IFile, MinecraftVersion } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { UploadCloud, X } from 'react-feather'
import styles from './FileDropzone.module.css'
import upload from '@/app/api/upload'
import FormComponent from '../Form/Form'
import { PopupMessage, PopupMessageType } from '../PopupMessage/PopupMessage'

const FileDropzone = ({ onFilesUploaded, presetFiles }: { presetImage?: string, onFilesUploaded(files: IFile[]) : void, presetFiles?: string }) => {
    const [files, setFiles] = useState<IFile[]>([])
    const [rejected, setRejected] = useState<FileRejection[]>([])

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            console.log("Got a valid file")
            acceptedFiles.forEach(file => {
                upload(file).then(url => {
                    if(url) {
                        onFilesUploaded(files);
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `Uploaded ${file.name}`))
                        setFiles([...files, {worldUrl: url, type: "", minecraftVersion: "", contentVersion: ""}])
                    } else {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, `Uploading ${file.name} failed`))
                    }
                });
            })
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
        if(presetFiles) {
            let files = JSON.parse(presetFiles) as IFile[]
            if(files && files.length > 0) {
                setFiles(files);
            }
        }
    }, [])

    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.worldUrl !== name))
        onFilesUploaded(files.filter(file => file.worldUrl !== name))
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
                            <div className={styles.uploaded_file_remove} onClick={() => {removeFile(file.worldUrl)}}> <X /> </div>
                            <FormComponent inputs={[
                                { name: "File", type: 'select', options: [{name: file.worldUrl.substring(file.worldUrl.lastIndexOf('/') + 1)}]},
                                { name: "Type", type: 'select', value: file.type, options: [{name: 'World', value: 'world'}, {name: 'Resourcepack', value: 'resourcepack'}, {name: "Datapack", value: 'datapack'}]},
                                { name: 'Minecraft Version', type: 'text', value: file.minecraftVersion },
                                { name: "Content Version", type: 'text', value: file.contentVersion}
                                ]} onSave={(inputs) => {
                                    file.type = inputs[1].value!
                                    file.minecraftVersion = inputs[2].value!
                                    file.contentVersion = inputs[3].value!
                                }} />
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default FileDropzone