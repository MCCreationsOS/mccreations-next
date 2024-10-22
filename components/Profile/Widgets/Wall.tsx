import { useUserStore } from "@/app/api/auth";
import { IUser, IComment } from "@/app/api/types";
import CommentForm from "@/components/Comment/ComentForm";
import CommentCard from "@/components/Comment/CommentCard";
import FormComponent from "@/components/Form/Form";
import Text from "@/components/FormInputs/Text";
import RichTextInput from "@/components/FormInputs/RichText";
import { useTranslations } from "next-intl";
import { getWall, sendWallPost, useProfileLayoutStore } from "@/app/api/creators";
import styles from './ProfileWidget.module.css'
import { FormInput } from "@/components/FormInputs";
import { useEffect, useState } from "react";
import { postComment } from "@/app/api/community";
import { MoreVertical } from "react-feather";
import { Popup } from "@/components/Popup/Popup";
import WarningButton from "@/components/Buttons/WarningButton";
import IconButton from "@/components/Buttons/IconButton";

export default function Wall({creator, canEdit, id}: {creator: IUser, canEdit: boolean, id: string}) {
    const [wallPosts, setWallPosts] = useState<IComment[]>([])
    const user = useUserStore(state => state)
    const t = useTranslations()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)

    useEffect(() => {
        let token = localStorage?.getItem('jwt')
        getWall(token + "", creator.handle + "").then((wall) => {
            setWallPosts(wall)
        })
    }, [])

    const saveWallPost = async (inputs: string[]) => {
        let token = localStorage?.getItem('jwt')
        postComment(creator.handle + "", "wall", creator.username, FormInput.getFormInput("comment").submit() + "", creator.handle).then(() => {
            getWall(token + "", creator.handle + "").then((wall) => {
                setWallPosts(wall)
            })
        })
    }

    const editWidget = () => {
        Popup.createPopup({
            title: t('Profile.Widgets.Wall.edit_title'),
            content: <FormComponent id="wallWidgetForm" onSave={saveWidget} options={{extraButtons: <WarningButton onClick={deleteWidget}>{t('Profile.Widgets.delete_widget')}</WarningButton>}}>
            </FormComponent>
        })
    }

    const saveWidget = (inputs: string[]) => {
        
    }


    const deleteWidget = () => {
        updateProfileLayout({
            widgets: profileLayout.widgets.filter((widget) => widget.id !== id),
            layout: profileLayout.layout.filter((layout) => layout.i !== id)
        })
    }

    return (
        <div className={styles.widget_container}>
            <h3 className={styles.draggable_handle} id="wall_title">{t('Profile.Widgets.Wall.title')}</h3>
            {canEdit && <IconButton className={`${styles.options}`} onClick={editWidget} ><MoreVertical/></IconButton>}
            <div className={styles.widget_content}>
                {user && user._id === creator._id && <FormComponent id="wallForm" onSave={saveWallPost} options={{saveButtonContent: t('CommentForm.send')}}>
                        <RichTextInput id="comment" name="New Post" className="compact"/>
                    </FormComponent>}
                {wallPosts && wallPosts.map((post, idx) => {
                    return (
                        <CommentCard comment={post} contentType="wall" handle={creator._id + ""} canReply={true}/>
                    )
                })}
            </div>
        </div>
    )
}