'use client'

import { FilePreview } from '@/app/api/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'lucide-react'
import styles from './ImageDropzone.module.css'
import upload from '@/app/api/upload'
import { useTranslations } from 'next-intl'
import { useToken } from '@/app/api/hooks/users'
import { toast } from 'sonner'
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from '@hello-pangea/dnd'
import { Button } from '../ui/button'

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
    const {token} = useToken();
    const t = useTranslations()

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            upload(acceptedFiles, token).then(uploadedFiles => {
                if(files) {
                    files.forEach(uploadedFile => {
                        toast.success(t('Components.Dropzone.uploaded', {file: uploadedFile.name}))
                    })

                    if(allowMultiple) {
                        setFiles(previousFiles => [
                            ...previousFiles,
                            ...uploadedFiles.map(file =>
                                {return { url: file.location, name: file.name }}
                            )
                        ])
                    } else {
                        setFiles([
                            ...uploadedFiles.map(file =>
                                {return { url: file.location, name: file.name }}
                            )
                        ])
                    }
                }
            })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                let message = file.file.name
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            message += t('Components.Dropzone.invalid_type', { type: t('Components.Dropzone.FileTypes.image') });
                            break;
                        case 'file-too-large':
                            message += t('Components.Dropzone.file_too_large', { size: '2MB' });
                            break;
                        default:
                            message += t('Components.Dropzone.file_unknown');
                            break;
                    }
                })
                toast.error(message)
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: 1024 * 2000,
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
        if(presetImage) {
            setFiles([{url: presetImage, name: presetImage}])
        }
    }, [])

    useEffect(() => {
        onImagesUploaded(files.map(file => ({url: file.url, name: file.name})));
    }, [files])

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

    const onDragEnd = useCallback((result: DropResult, provided: ResponderProvided) => {
        if(result.destination?.index) {
            moveFile(result.source.index, result.destination.index)
        }
      }, []);

      const moveFile = (from: number, to: number) => {
          setFiles(prevFiles => {
              const newFiles = [...prevFiles]
              newFiles.splice(to, 0, newFiles.splice(from, 1)[0])
              return newFiles
            })
    }

    return (
        <div className='flex flex-col md:flex-row gap-4 w-[100%] overflow-auto'>
            <form>
                <div {...getRootProps()} className='max-w-[300px] h-[150px] w-fit min-w-[150px] mx-auto'>
                    <input {...getInputProps({ name: 'file' })} />
                    <div className="max-w-[300px] h-[150px] w-fit min-w-[150px] relative group">
                        <Image className="object-cover hover:opacity-50 max-w-[300px] h-[150px] w-fit" src={(files[files.length - 1] && files[files.length - 1].url) ? files[files.length - 1].url : "/defaultBanner.png"} width={1920} height={1080} alt=''></Image>
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/50 p-4">
                            <UploadCloud></UploadCloud>
                            {isDragActive ? (
                                <span>{t('Components.Dropzone.hovering')}</span>
                            ) : (
                                <span>{t('Components.Dropzone.dropzone')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            {(allowMultiple) ?
             <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                        <div ref={provided.innerRef} className="flex flex-row gap-2 overflow-auto flex-nowrap" {...provided.droppableProps}>
                            {files.map((file, idx) =>
                                (
                                    <Draggable key={`image-${file.name.substring(file.name.lastIndexOf('/') + 1, file.name.length - 4)}`} draggableId={`image-${file.name.substring(file.name.lastIndexOf('/') + 1, file.name.length - 4)}`} index={idx}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <GalleryImage url={file.url} name={file.name} removeFile={removeFile} />
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                <input type='hidden' name='files' value={JSON.stringify(files)} />
            </DragDropContext>
            : <></>}
        </div>
    )
}


export function GalleryImage({url, name, removeFile}: {url: string, name: string, removeFile: (name: string) => void}) {
    
    return (
        <div className="max-w-[300px] h-[150px] w-fit min-w-[150px] relative group">
            <Image className="object-cover hover:opacity-50 max-w-[300px] h-[150px] w-fit" src={url} width={150} height={150} alt={`${url.substring(url.lastIndexOf('/') + 1)}`}></Image>
            <Button className="absolute top-2 right-2 hidden group-hover:flex" variant="destructive" size="icon" onClick={() => removeFile(name)}><X className='w-4 h-4'/></Button>
        </div>
    )
}

export default ImageDropzone