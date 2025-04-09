import { MoreVertical } from 'lucide-react'
import styles from './ProfileWidget.module.css'
import { Popup } from '@/components/Popup/Popup'
import FormComponent from '@/components/Form/Form'
import WarningButton from '@/components/Buttons/WarningButton'
import Text from '@/components/FormInputs/Text'
import { useProfileLayoutStore } from '@/app/api/creators'
import { useTranslations } from 'next-intl'
import IconButton from '@/components/Buttons/IconButton'
import { useToken } from '@/app/api/hooks/users'
export default function Discord({serverId, canEdit, id}: {serverId: string, canEdit: boolean, id: string}) {
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Discord.edit_title'),
            content: <FormComponent id="discordForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <Text name={t('Profile.Widgets.Discord.server_id')} value={serverId}/>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        updateProfileLayout({
            widgets: profileLayout.widgets.map((widget) => {
                if(widget.id === id) {
                    return {...widget, data: {serverId: inputs[0]}}
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

    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.Discord.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <div className={styles.widget_content}>
                <iframe src={`https://discord.com/widget?id=${serverId}&theme=dark`} width="100%" allowTransparency={true} sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts" frameBorder="0" style={{minHeight: "250px"}}></iframe>
            </div>
        </div>
    )
}