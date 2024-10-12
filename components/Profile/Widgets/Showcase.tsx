import { getContent } from "@/app/api/content";
import { CollectionNames, IContentDoc, IUser } from "@/app/api/types";
import ContentSlideshow from "@/components/ContentSlideshow/ContentSlideshow";
import { useEffect, useState } from "react";
import styles from './ProfileWidget.module.css'
import { MoreVertical } from "react-feather";
import { useTranslations } from "next-intl";
import FormComponent from "@/components/Form/Form";
import Text from "@/components/FormInputs/Text";
import { Popup } from "@/components/Popup/Popup";
import { useProfileLayoutStore } from "@/app/api/creators";
import WarningButton from "@/components/Buttons/WarningButton";
import IconButton from "@/components/Buttons/IconButton";
import Select from "@/components/FormInputs/Select";

export default function Showcase({id, creator, type, canEdit}: {id: string, creator: IUser, type: CollectionNames | "content", canEdit: boolean}) {
    const [content, setContent] = useState<IContentDoc[]>([])
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)

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
        })
        getContent({limit: 10, contentType: inputs[0] as CollectionNames, creator: creator.handle}).then((content) => {
            setContent(content.documents)
        })
    }

    const deleteWidget = () => {
        updateProfileLayout({
            widgets: profileLayout.widgets.filter((widget) => widget.id !== id),
            layout: profileLayout.layout.filter((layout) => layout.i !== id)
        })
    }

    useEffect(() => {
        getContent({limit: 10, contentType: type, creator: creator.handle}).then((content) => {
            setContent(content.documents)
        })
    }, [])

    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.Showcase.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <ContentSlideshow content={content} playlist={id}/>
        </div>
    )
}