import { fetchMap, fetchDatapack, fetchResourcepack } from "@/app/api/content"
import { ContentTypes, IContentDoc } from "@/app/api/types"
import styles from './ProfileWidget.module.css'
import CreationCard from "@/components/Creations/Cards/Card"
import { useState, useEffect } from "react"
import { MoreVertical } from "lucide-react"
import { useTranslations } from "next-intl"
import { useProfileLayoutStore } from "@/app/api/creators"
import { Popup } from "@/components/Popup/Popup"
import FormComponent from "@/components/Form/Form"
import WarningButton from "@/components/Buttons/WarningButton"
import Text from "@/components/FormInputs/Text"
import IconButton from "@/components/Buttons/IconButton"
import { useCreation } from "@/app/api/hooks/creations"
import { useToken } from "@/app/api/hooks/users"

export default function FeaturedCreation({type, slug, canEdit, id}: {type: ContentTypes, slug: string, canEdit: boolean, id: string}) {
    let {creation, isLoading, error} = useCreation(slug, type)
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.FeaturedCreation.edit_title'),
            content: <FormComponent id="featuredCreationForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <Text name={t('Profile.Widgets.FeaturedCreation.type')} value={type}/>
                <Text name={t('Profile.Widgets.FeaturedCreation.slug')} value={slug}/>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        updateProfileLayout({
            widgets: profileLayout.widgets.map((widget) => {
                if(widget.id === id) {
                    return {...widget, data: {type: inputs[0], slug: inputs[1]}}
                }
                return widget
            }),
            layout: profileLayout.layout
        }, token)
    }

    const deleteWidget = () => {
        updateProfileLayout({
            widgets: profileLayout.widgets.filter((widget) => widget.id !== id),
            layout: profileLayout.layout.filter((layout) => layout.i !== id)
        }, token)
    }
    
    if (!creation || isLoading || 'error' in creation) {
        return <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.FeaturedCreation.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            No content found
        </div>
    }
    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.FeaturedCreation.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <CreationCard creation={creation} playlist={""} index={0} priority={true} />
        </div>
    )
}