'use client'

import { convertToCollection, createEmptyCreation, updateContent } from "@/app/api/content";
import { useTokenOrKey } from "@/app/api/hooks/users";
import { ContentTypes, IContentDoc, IFile } from "@/app/api/types";
import { Button } from "@/components/ui/button";
import VersionManager from "@/components/VersionManager/VersionManager";
import { useForm } from "@tanstack/react-form";
// import MainButton from "@/components/Buttons/MainButton";
// import VersionManager from "@/components/FormInputs/VersionUploader/VersionManager";
// import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import { useTranslations } from "next-intl";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSessionStorage } from "usehooks-ts";

export default function Versions({params}: {params: Params}) {
    const [creation, setCreation] = useSessionStorage<IContentDoc>('tempCreation', createEmptyCreation())
    const contentType = creation.type
    const collectionName = convertToCollection(contentType)
    const {token} = useTokenOrKey();
    const t = useTranslations()
    const router = useRouter()
    
    const saveVersionsForm = (versions: string) => {
        if(!creation || 'error' in creation) return;

        let newCreation = {
            ...creation
        }
        newCreation.files = JSON.parse(versions)
        
        newCreation.files?.sort((a, b) => {
            return b.createdDate - a.createdDate
        })

        updateContent(newCreation, token, collectionName).then(() => {
            setCreation(newCreation)
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.versions_saved')))
            toast.success(t('Content.Edit.PopupMessage.versions_saved'))
        }).catch((e) => {
            // PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, e.error))
            toast.error(e.error)
        })
    }

    return <>
        <VersionManager collectionName={collectionName} presetVersions={JSON.stringify(creation.files)} onVersionsChanged={saveVersionsForm} />
        <Button onClick={() => {
            router.push(`/${params.locale}/create/images`)
        }}><span>{t('Create.next')}</span></Button>
    </>
}