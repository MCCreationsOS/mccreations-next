'use client'

import { FilePreview } from '@/app/api/types'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'react-feather'
import styles from './MediaGallery.module.css'
import upload from '@/app/api/upload'
import { PopupMessage, PopupMessageType } from '../../PopupMessage/PopupMessage'
import { UploadedImageRepresentation } from '../ImageDropzone/ImageDropzone'
import GalleryImage from './GalleryImage'
import { useI18n } from '@/locales/client'
import MapImageSlideshow from '@/components/MapImageSlideshow/MapImageSlideshow'
import { DragDropContext, Draggable, DragUpdate, Droppable, DropResult, ResponderProvided } from 'react-beautiful-dnd'

/**
 * A gallery of images that can be uploaded
 * @param onImagesUploaded The function to call when images are uploaded
 * @param presetFiles The preset files to display
 */
const MediaGallery = ({ onImagesUploaded, presetFiles }: { onImagesUploaded(files: UploadedImageRepresentation[]) : void, presetFiles?: string }) => {
    const [files, setFiles] = useState<UploadedImageRepresentation[]>([])
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const t = useI18n();

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {
            acceptedFiles.forEach(file => {
                upload(file).then(url => {
                    if(url) {
                        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, `${t('form.images.uploaded')}${file.name}`))
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
                let message = file.file.name
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            message += t('form.images.invalid');
                            break;
                        case 'file-too-large':
                            message += t('form.images.too_large');
                            break;
                        default:
                            message += t('form.images.unknown_error');
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
        <DragDropContext onDragEnd={onDragEnd}>
            <MapImageSlideshow images={files.map(file => file.url)} />
            <Droppable droppableId="droppable" direction="horizontal">
            {(provided, snapshot) => (
                    <div ref={provided.innerRef} className={styles.gallery} {...provided.droppableProps}>
                        {files.map((file, idx) =>
                            (
                                <Draggable key={`image-${file.name.substring(file.name.lastIndexOf('/') + 1, file.name.length - 4)}`} draggableId={`image-${file.name.substring(file.name.lastIndexOf('/') + 1, file.name.length - 4)}`} index={idx}>
                                    {(provided, snapshot) => (
                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <GalleryImage id={file.name} idx={idx} url={file.url} name={file.name} removeFile={removeFile} moveFile={moveFile} />
                                        </div>
                                    )}
                                </Draggable>
                            )
                        )}
                        {provided.placeholder}
                        <div {...getRootProps()} className={styles.upload}>
                            <input {...getInputProps({ name: 'file' })} />
                            <Plus />
                            <p>{t('form.images.drop_zone')}</p>
                        </div>
                    </div>
                )}
            </Droppable>
            <input type='hidden' name='files' value={JSON.stringify(files)} />
        </DragDropContext>
        
    )
}

export default MediaGallery