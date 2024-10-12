import { MoreVertical } from 'react-feather'
import styles from './ProfileWidget.module.css'
import FormComponent from '@/components/Form/Form'
import Text from '@/components/FormInputs/Text'
import { Popup } from '@/components/Popup/Popup'
import { useProfileLayoutStore } from '@/app/api/creators'
import WarningButton from '@/components/Buttons/WarningButton'
import IconButton from '@/components/Buttons/IconButton'
import { useTranslations } from 'next-intl';

export default function Twitch({handle, canEdit, id}: {handle: string, canEdit: boolean, id: string}) {
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Twitch.edit_title'),
            content: <FormComponent id="twitchWidgetForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <Text name={t('Profile.Widgets.Twitch.handle')} value={handle}/>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        updateProfileLayout({
            widgets: profileLayout.widgets.map((widget) => {
                if(widget.id === id) {
                    return {...widget, data: {handle: inputs[0]}}
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

    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.Twitch.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <div className={styles.widget_content}>
                <iframe src={`https://player.twitch.tv/?channel=${handle}&parent=localhost`} frameBorder="0" allowFullScreen width="100%" height="100%" style={{aspectRatio: "16/9"}}></iframe>
            </div>
        </div>
    )
}