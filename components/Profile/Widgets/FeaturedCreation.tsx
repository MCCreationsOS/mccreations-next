import { fetchMap, fetchDatapack, fetchResourcepack } from "@/app/api/content"
import { ContentTypes, IContentDoc } from "@/app/api/types"
import styles from './ProfileWidget.module.css'
import ContentCard from "@/components/ContentSlideshow/ContentCard"
import { useState, useEffect } from "react"
import { MoreVertical } from "react-feather"
import { useTranslations } from "next-intl"
import { useProfileLayoutStore } from "@/app/api/creators"
import { Popup } from "@/components/Popup/Popup"
import FormComponent from "@/components/Form/Form"
import WarningButton from "@/components/Buttons/WarningButton"
import Text from "@/components/FormInputs/Text"
import IconButton from "@/components/Buttons/IconButton"

export default function FeaturedCreation({type, slug, canEdit, id}: {type: ContentTypes, slug: string, canEdit: boolean, id: string}) {
    let [content, setContent] = useState<IContentDoc | null>(null)
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)

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
        })
    }

    const deleteWidget = () => {
        updateProfileLayout({
            widgets: profileLayout.widgets.filter((widget) => widget.id !== id),
            layout: profileLayout.layout.filter((layout) => layout.i !== id)
        })
    }

    useEffect(() => {
        switch(type) {
            case "map":
                fetchMap(slug).then(setContent)
                break
            case "datapack":
                fetchDatapack(slug).then(setContent)
                break
            case "resourcepack":
                fetchResourcepack(slug).then(setContent)
                break
        }
    }, [])
    
    if (!content) {
        return <div>No content found</div>
    }
    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.FeaturedCreation.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <ContentCard content={content} playlist={""} index={0} priority={true} />
        </div>
    )
}