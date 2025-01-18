'use client'

import { convertToCollection, createEmptyCreation, updateContent } from "@/app/api/content"
import { useTokenOrKey } from "@/app/api/hooks/users"
import { ContentTypes, IContentDoc } from "@/app/api/types"
import { UploadedImageRepresentation } from "@/components/FormInputs/ImageDropzone/ImageDropzone"
import MediaGallery from "@/components/FormInputs/MediaGallery/MediaGallery"
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage"
import { useTranslations } from "next-intl"
import { Params } from "next/dist/shared/lib/router/utils/route-matcher"
import { useSessionStorage } from "usehooks-ts"

export default function Images({params}: {params: Params}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.substring(0, params.contentType.length-1) : params.contentType) as ContentTypes
    const collectionName = convertToCollection(contentType)
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const {token} = useTokenOrKey();
    const t = useTranslations()

    const saveImagesForm = (files: UploadedImageRepresentation[]) => {
        if(!creation || 'error' in creation) return;

        let newCreation = {
            ...creation
        }
        newCreation.images = files.map(f => f.url)
        updateContent(newCreation, token, collectionName).then(() => {
            setCreation(newCreation)
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.images_saved')))
        }).catch((e) => {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
        })
    }

    return <MediaGallery onImagesUploaded={saveImagesForm} presetFiles={JSON.stringify(creation?.images?.map(image => {return {url: image, name: image}}))}/>
}