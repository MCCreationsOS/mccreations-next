'use client'

import { FilePreview } from '@/app/api/types'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Plus, UploadCloud, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useToken } from '@/app/api/hooks/users'
import { toast } from 'sonner'
import { DragDropContext, Draggable, Droppable, DropResult, ResponderProvided } from '@hello-pangea/dnd'
import { Button } from '../ui/button'
import { Uploader } from '@/app/api/upload'
import { shimmer, toBase64 } from '../skeletons/imageShimmer'
import { Progress } from '../ui/progress'

/**
 * The representation of an uploaded image
 * @param name The name of the image
 * @param url The url of the image
 */
export interface UploadedImageRepresentation {
    name: string,
    url?: string,
    progress: number,
    uploaded: boolean
}

/**
 * A dropzone for images, uses react-dropzone
 * @param presetImage The preset image to display
 * @param onImagesUploaded The function to call when images are uploaded
 * @param allowMultiple Whether or not the dropzone should allow multiple images to be uploaded
 * @param presetFiles The preset files to display
 */
/** Matches the API's per-file upload limit */
const MAX_IMAGE_SIZE_MB = 30

function initialFiles(presetFiles?: string, presetImage?: string): UploadedImageRepresentation[] {
    if(presetImage) return [{url: presetImage, name: presetImage, progress: 100, uploaded: true}]
    if(presetFiles) {
        try {
            const files = JSON.parse(presetFiles) as UploadedImageRepresentation[] | null
            if(files && files.length > 0) return files.map(file => ({...file, progress: file.progress ?? 100, uploaded: file.uploaded ?? true}))
        } catch {}
    }
    return []
}

const ImageDropzone = ({ forWhat, presetImage, onImagesUploaded, allowMultiple, presetFiles }: { forWhat: string, presetImage?: string, onImagesUploaded(files: UploadedImageRepresentation[]) : void, allowMultiple: boolean, presetFiles?: string }) => {
    const [files, setFiles] = useState<UploadedImageRepresentation[]>(() => initialFiles(presetFiles, presetImage))
    const isFirstRender = useRef(true)
    const [rejected, setRejected] = useState<FileRejection[]>([])
    const [progress, setProgress] = useState<number>(100)
    const {token} = useToken();
    const t = useTranslations()

    let batch = files.filter(file => file.uploaded === false)
    let currentFile = Math.floor(progress / (100/batch.length))
    if (progress !== 100 && batch.length > 0) batch[currentFile].progress = (progress * batch.length) % 100
    for(let i = 0; i < currentFile; i++) {
        batch[i].progress = 100
    }

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles?.length) {

            const uploader = new Uploader(acceptedFiles, token, forWhat)
            setFiles(previousFiles => [...previousFiles, ...acceptedFiles.map(file => ({name: file.name, progress: 0, uploaded: false}))])
            uploader.onProgress = (progress: number) => {
                setProgress(progress)
            }
            uploader.onComplete = (uploadedFiles: {type: string, name: string, location: string}[]) => {
                if(allowMultiple) {
                    setFiles(previousFiles => [
                        ...previousFiles.filter(file => file.uploaded === true),
                        ...uploadedFiles.map(file => ({name: file.name, url: file.location, progress: 100, uploaded: true}))
                    ])
                } else {
                    setFiles([{name: uploadedFiles[0].name, url: uploadedFiles[0].location, progress: 100, uploaded: true}])
                }
            }
            uploader.onError = (error: Error) => {
                toast.error(error.message)
                // Drop the placeholders for this batch so they don't sit at 0% forever
                setFiles(previousFiles => previousFiles.filter(file => file.uploaded === true))
                setProgress(100)
            }
            uploader.upload().catch(() => { /* reported through onError */ })
        }

        if (rejectedFiles?.length) {
            setRejected(previousFiles => [...previousFiles, ...rejectedFiles])
            rejectedFiles.forEach(file => {
                let message = file.file.name + " - "
                file.errors.forEach(error => {
                    switch (error.code) {
                        case 'file-invalid-type':
                            message += t('Components.Dropzone.invalid_type', { type: t('Components.Dropzone.FileTypes.image') });
                            break;
                        case 'file-too-large':
                            message += t('Components.Dropzone.file_too_large', { max_size: `${MAX_IMAGE_SIZE_MB}MB` });
                            break;
                        default:
                            message += t('Components.Dropzone.file_unknown');
                            break;
                    }
                })
                toast.error(message)
            })
        }
    }, [token, forWhat, allowMultiple, t])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        maxSize: MAX_IMAGE_SIZE_MB * 1024 * 1024,
        maxFiles: (allowMultiple) ? 10 : 1,
        onDrop
    })

    useEffect(() => {
        // Only report real changes, not the presets we started with
        if(isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        onImagesUploaded(files.map(file => ({url: file.url, name: file.name, progress: file.progress, uploaded: file.uploaded})));
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        if(result.destination?.index !== undefined) {
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
                <div {...getRootProps()} className='w-150px h-150px relative'>
                    <input {...getInputProps({ name: 'file' })} />
                    <div className="max-w-[300px] h-[150px] w-fit min-w-[150px] relative group">
                        {!allowMultiple && files.length === 1 && <Image className="object-cover hover:opacity-50 max-w-[300px] h-[150px] w-fit" src={files[0].url ? files[0].url : "/defaultBanner.png"} width={1920} height={1080} alt=''></Image>}
                        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black/50 p-4">
                            <UploadCloud></UploadCloud>
                            {isDragActive ? (
                                <span>{t('Components.Dropzone.hovering')}</span>
                            ) : (
                                <span>{t('Components.Dropzone.dropzone')}</span>
                            )}
                        </div>
                    </div>
                    {!allowMultiple && progress !== 100 && <Progress value={progress} className="absolute bottom-0 left-0 w-full"    />}
                </div>
            {(allowMultiple) ?
             <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                {(provided, snapshot) => (
                        <div ref={provided.innerRef} className="flex flex-row gap-2 overflow-auto flex-nowrap" {...provided.droppableProps}>
                            {files.map((file, idx) =>
                                (
                                    <Draggable key={`image-${file.url ?? file.name}-${idx}`} draggableId={`image-${file.url ?? file.name}-${idx}`} index={idx}>
                                        {(provided, snapshot) => (
                                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                <GalleryImage url={file.url ? file.url : `data:image/svg+xml;base64,${toBase64(shimmer(1280, 720))}`} name={file.name} removeFile={removeFile} />
                                                {file.progress !== 100 && <Progress value={file.progress} />}
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
    const t = useTranslations()

    return (
        <div className="max-w-[300px] h-[150px] w-fit min-w-[150px] relative group">
            <Image className="object-cover hover:opacity-50 max-w-[300px] h-[150px] w-fit" src={url} width={150} height={150} alt={`${url.substring(url.lastIndexOf('/') + 1)}`}></Image>
            <Button type="button" className="absolute top-2 right-2 flex md:hidden md:group-hover:flex md:group-focus-within:flex" variant="destructive" size="icon" aria-label={t('Components.Dropzone.remove', {name: name.substring(name.lastIndexOf('/') + 1)})} onClick={() => removeFile(name)}><X className='w-4 h-4'/></Button>
        </div>
    )
}

export default ImageDropzone