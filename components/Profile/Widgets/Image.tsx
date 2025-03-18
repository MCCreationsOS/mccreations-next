import { MoreVertical } from 'react-feather'
import styles from './ProfileWidget.module.css'
import Image from 'next/image'
import FormComponent from '@/components/Form/Form'
import WarningButton from '@/components/Buttons/WarningButton'
import Text from '@/components/FormInputs/Text'
import { useTranslations } from 'next-intl'
import { useProfileLayoutStore } from '@/app/api/creators'
import { Popup } from '@/components/Popup/Popup'
import ImageInput from '@/components/FormInputs/ImageDropzone'
import IconButton from '@/components/Buttons/IconButton'
import { useToken } from '@/app/api/hooks/users'

export default function ImageWidget({image, title, canEdit, id}: {image: string, title: string, canEdit: boolean, id: string}) {
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Image.edit_title'),
            content: <FormComponent id="imageForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <ImageInput name={t('Profile.Widgets.Image.image')} value={JSON.stringify([{url: image, name: "Image"}])}/>
                <Text name={t('Profile.Widgets.Image.title')} value={title}/>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        updateProfileLayout({
            widgets: profileLayout.widgets.map((widget) => {
                if(widget.id === id) {
                    return {...widget, data: {image: JSON.parse(inputs[0])[0].url, title: inputs[1]}}
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
            <h3 className={styles.draggable_handle}>{title}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <div className={styles.widget_content}>
                <Image className={styles.image} src={image} alt="Image" width={1920} height={1080} />
            </div>
        </div>
    )
}