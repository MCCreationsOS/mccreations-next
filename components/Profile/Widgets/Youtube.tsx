import { useEffect, useState } from 'react'
import styles from './ProfileWidget.module.css'
import { MoreVertical } from 'react-feather'
import { useProfileLayoutStore } from '@/app/api/creators'
import FormComponent from '@/components/Form/Form'
import Text from '@/components/FormInputs/Text'
import { Popup } from '@/components/Popup/Popup'
import WarningButton from '@/components/Buttons/WarningButton'
import IconButton from '@/components/Buttons/IconButton'
import { useTranslations } from 'next-intl'
import { useToken } from '@/app/api/hooks/users'

export default function Youtube({handle, canEdit, id}: {handle: string, canEdit: boolean, id: string}) {
    const t = useTranslations()
    const [video, setVideo] = useState<any[]>([])
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();

    useEffect(() => {
        fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,contentDetails&forHandle=${handle}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)
            .then(res => res.json())
            .then(data => {
                fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${data.items[0].contentDetails.relatedPlaylists.uploads}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`)
                    .then(res => res.json())
                    .then(data => {
                        setVideo(data.items[0].contentDetails.videoId)
                    })
            })
    }, [])

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Youtube.edit_title'),
            content: <FormComponent id="youtubeWidgetForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <Text name={t('Profile.Widgets.Youtube.handle')} value={handle}/>
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
            <h3 className={styles.draggable_handle}>{t('Profile.Widgets.Youtube.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <div className={styles.widget_content}><iframe width="100%" height="100%" style={{aspectRatio: 16/9}} src={`https://www.youtube-nocookie.com/embed/${video}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            </div>
        </div>
    )
}