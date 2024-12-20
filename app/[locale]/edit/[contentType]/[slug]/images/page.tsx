'use client'

import { convertToCollection, updateContent } from "@/app/api/content"
import { useCreation } from "@/app/api/hooks/creations"
import { ContentTypes } from "@/app/api/types"
import { UploadedImageRepresentation } from "@/components/FormInputs/ImageDropzone/ImageDropzone"
import MediaGallery from "@/components/FormInputs/MediaGallery/MediaGallery"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { useTranslations } from "next-intl"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { mutate } from "swr"

export default function Images({params}: {params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const collectionName = convertToCollection(contentType)
    const { creation, isLoading } = useCreation(params.slug, contentType)
    const t = useTranslations()

    if((creation && 'error' in creation)) {
        return <div className="centered_content">
            <h1>Something went wrong!</h1>
            <p>{creation?.error}</p>
        </div>
    } else if(isLoading) {
        return <div className="centered_content">
            <h1>Loading...</h1>
        </div>
    }

    const saveImagesForm = (files: UploadedImageRepresentation[]) => {
        if(!creation || 'error' in creation) return;

        let newCreation = {
            ...creation
        }
        newCreation.images = files.map(f => f.url)
        updateContent(newCreation, localStorage?.getItem('jwt') + "", collectionName).then(() => {
            mutate(newCreation)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.images_saved')))
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
        })
    }

    return <MediaGallery onImagesUploaded={saveImagesForm} presetFiles={JSON.stringify(creation?.images?.map(image => {return {url: image, name: image}}))}/>
}