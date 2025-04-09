import { searchContent } from "@/app/api/content";
import { CollectionNames, IContentDoc, IUser } from "@/app/api/types";
import ContentSlideshow from "@/components/ContentSlideshow/ContentSlideshow";
import { useEffect, useState } from "react";
import styles from './ProfileWidget.module.css'
import { MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import FormComponent from "@/components/Form/Form";
import { Popup } from "@/components/Popup/Popup";
import { useProfileLayoutStore } from "@/app/api/creators";
import WarningButton from "@/components/Buttons/WarningButton";
import IconButton from "@/components/Buttons/IconButton";
import Select from "@/components/FormInputs/Select";
import { useCreations } from "@/app/api/hooks/creations";
import { useToken } from "@/app/api/hooks/users";

export default function Showcase({id, creator, type, canEdit}: {id: string, creator: IUser, type: CollectionNames | "content", canEdit: boolean}) {
    const {creations} = useCreations({limit: 10, contentType: type, creators: [creator.handle!], status: 1})
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();


    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Showcase.edit_title'),
            content: <FormComponent id="showcaseForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <Select name={t('Profile.Widgets.Showcase.type')} value={type} options={[{name: "All Creations", value: "content"}, {name: "Maps", value: "Maps"}, {name: "Data Packs", value: "datapacks"}, {name: "Resource Packs", value: "resourcepacks"}]}/>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        updateProfileLayout({
            widgets: profileLayout.widgets.map((widget) => {
                if(widget.id === id) {
                    return {...widget, data: {type: inputs[0]}}
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
    
    if(!creations) {
        return <div className={styles.widget_container}>Loading...</div>
    }

    return (
        <div className={styles.widget_container}>

            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.Showcase.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <ContentSlideshow content={creations} playlist={id}/>
        </div>
    )
}