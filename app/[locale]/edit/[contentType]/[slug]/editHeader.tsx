'use client'

import { ContentTypes } from "@/app/api/types";
import { useTranslations } from "next-intl";
import MainButton from "@/components/Buttons/MainButton";
import { convertToCollection, errorCheckContent, requestApproval } from "@/app/api/content";
import { useCreation } from "@/app/api/hooks/creations";
import { PopupMessage, PopupMessageType } from "@/components/PopupMessage/PopupMessage";
import { mutate } from "swr";
import styles from "./edit.module.css"
import SecondaryButton from "@/components/Buttons/SecondaryButton";
import { useUser } from "@/app/api/hooks/users";
import { canEdit } from "@/app/api/creators";

export default function EditHeader({slug, contentType}: {slug: string, contentType: ContentTypes}) {
    const { creation, isLoading } = useCreation(slug, contentType)
    const {user, isLoading: userLoading} = useUser()
    const collectionName = convertToCollection(contentType)
    const t = useTranslations()

    const publishContent = async () => {
        if(!creation || 'error' in creation) return;

        let errors = errorCheckContent(creation)
        if(errors.length > 0) {
            errors.forEach((error) => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t(error.error)))
            })
        } else {
            requestApproval(creation.slug, collectionName, localStorage?.getItem('jwt') + "").then(() => {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.Edit.PopupMessage.requested_approval')))
                mutate({...creation, status: 1})
            })
        }
    }

    if(!creation || 'error' in creation || isLoading) {
        return <div className={styles.edit_header}>
            <h1>{t('Content.Files.loading')}</h1>
            <p>{t('Content.Files.loading')}</p>
            <SecondaryButton>{t('Content.Edit.request_approval')}</SecondaryButton>
        </div>;
    }

    if(user && creation && !canEdit(creation, user) || (!user && !userLoading)) {
        window.location.href = `/${contentType}s/${slug}`
    }

    return <div className={styles.edit_header}>
        <h1>{t('Content.Edit.editing', {title: creation?.title})}</h1>
        <p>{t('Content.Edit.status')} {(creation?.status === 0) ? <span style={{color: "#c73030"}}>{t('Status.draft')}</span> : (creation?.status === 1) ? <span style={{color: "#f0b432"}}>{t('Status.unapproved')}</span> : (creation?.status === 2) ? <span style={{color: "#10b771"}}>{t('Status.approved')}</span>: <span style={{color:"#3154f4"}}>{t('Status.featured')}</span>}</p>
        {creation?.status === 0 && (<MainButton onClick={publishContent}>{t('Content.Edit.request_approval')}</MainButton>)}
    </div>
}