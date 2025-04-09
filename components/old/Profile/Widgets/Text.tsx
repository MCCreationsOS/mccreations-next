import { MoreVertical } from 'lucide-react';
import styles from './ProfileWidget.module.css'
import DOMPurify from 'isomorphic-dompurify';
import FormComponent from '@/components/Form/Form';
import Text from '@/components/FormInputs/Text';
import { useProfileLayoutStore } from '@/app/api/creators';
import { Popup } from '@/components/Popup/Popup';
import WarningButton from '@/components/Buttons/WarningButton';
import RichTextInput from '@/components/FormInputs/RichText';
import { FormInput } from '@/components/FormInputs';
import IconButton from '@/components/Buttons/IconButton';
import { useTranslations } from 'next-intl';
import { useToken } from '@/app/api/hooks/users';

export default function TextWidget({text, title, canEdit, id}: {text: string, title: string, canEdit: boolean, id: string}) {
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)
    const {token} = useToken();

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Text.edit_title'),
            content: <FormComponent id="textWidgetForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
                <Text name={t('Profile.Widgets.Text.title')} value={title}/>
                <RichTextInput name={t('Profile.Widgets.Text.text')} value={text} id={id}/>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        updateProfileLayout({
            widgets: profileLayout.widgets.map((widget) => {
                if(widget.id === id) {
                    return {...widget, data: {title: inputs[0], text: FormInput.getFormInput(id).submit()}}
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
            <div className={`${styles.widget_content} ${styles.padded_content}`} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(text) }} />
        </div>
    )
}