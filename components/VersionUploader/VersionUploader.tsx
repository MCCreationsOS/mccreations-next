'use client'

import { FilePreview, IFile, MinecraftVersion } from '@/app/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'react-feather'
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

    useEffect(() => {
        onFilesUploaded(files)
    }, [files])

    const removeFile = (name: string) => {
        setFiles(files => files.filter(file => file.worldUrl !== name))
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
            <div className={styles.uploaded_files}>
                {files.map((file, idx) => {
                    return (
                        <div key={idx} className={styles.uploaded_file_wrapper}>
                            <div className={styles.uploaded_file_remove} onClick={() => {removeFile(file.worldUrl)}}> <X /> </div>
                            <FormComponent inputs={[
                                { name: "File", type: 'select', options: [{name: (file.worldUrl[file.worldUrl.length-1] === '/') ? file.worldUrl.substring(0, file.worldUrl.length - 2).substring(file.worldUrl.lastIndexOf('/') + 1)  : file.worldUrl.substring(file.worldUrl.lastIndexOf('/') + 1)}]},
                                { name: "Type", type: 'select', value: file.type, options: [{name: 'World', value: 'world'}, {name: 'Resourcepack', value: 'resourcepack'}, {name: "Datapack", value: 'datapack'}]},
                                { name: 'Minecraft Version', type: 'text', value: file.minecraftVersion },
                                { name: "Content Version", type: 'text', value: file.contentVersion}
                                ]} onSave={(inputs) => {
                                    let newFiles = [...files];
                                    newFiles[idx].type = inputs[1].value!
                                    newFiles[idx].minecraftVersion = inputs[2].value!
                                    newFiles[idx].contentVersion = inputs[3].value!
                                    setFiles(newFiles)
                                }} />
                        </div>
                    )
                })}
                <div  className={styles.upload}>
                    <div {...getRootProps()} className={styles.dnd}>
                        <input {...getInputProps({ name: 'file' })} />
                        <Plus />
                        <p>Drag and Drop here or click to upload a new version</p>
                    </div>
                    <p>Or...</p>
                    <div className={styles.dnd}>
                        <FormComponent inputs={[{name: "Link", type: 'text'}]} onSave={(inputs) => {
                            let url = inputs[0].value
                            if(url) {
                                setFiles([...files, {worldUrl: url, type: "", minecraftVersion: "", contentVersion: ""}])
                            }
                        }} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default FileDropzone