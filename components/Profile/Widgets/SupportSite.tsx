import InContentAdUnit, { AdsenseComponent } from "@/components/AdUnits/InContent";
import styles from './ProfileWidget.module.css'
import { MoreVertical } from "react-feather";
import FormComponent from "@/components/Form/Form";
import WarningButton from "@/components/Buttons/WarningButton";
import { Popup } from "@/components/Popup/Popup";
import { useProfileLayoutStore } from "@/app/api/creators";
import IconButton from "@/components/Buttons/IconButton";
import { useTranslations } from "next-intl";
import { useToken } from "@/app/api/hooks/users";

export default function SupportSite({canEdit, id}: {canEdit: boolean, id: string}) {
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.SupportSite.edit_title'),
            content: <FormComponent id="supportSiteForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        
    }

    const deleteWidget = () => {
        updateProfileLayout({
            widgets: profileLayout.widgets.filter((widget) => widget.id !== id),
            layout: profileLayout.layout.filter((layout) => layout.i !== id)
        }, token)
    }

    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.SupportSite.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <AdsenseComponent adSlot={9704091120} adFormat={"fluid"} adClient='ca-pub-5425604215170333' adLayout={undefined} width="100%" height="100%" />
        </div>
    )
}