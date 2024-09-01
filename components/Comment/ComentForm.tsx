'use client'

import { Suspense, useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/api/types";
import { getUser } from "@/app/api/auth";
import MainButton from "../Buttons/MainButton";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import RichText from "../FormInputs/RichText";
import { useI18n } from "@/locales/client";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";

export default function CommentForm({mapSlug: slug, content_type}: {mapSlug: string, content_type: string}) {
    const [comment, setComment] = useState("");
    const [user, setUser] = useState<IUser>()
    const t = useI18n();
    let token;

    useEffect(() => {
        const getData = async () => {
            let token = sessionStorage.getItem('jwt')
            if(token) {
                let user = await getUser(undefined, token)
                if(user) {
                    setUser(user);
                }
            }
        }
        getData();
    }, [])

    const sendComment = async (inputs: string[]) => {
        if(user) {
            postComment(slug, content_type, inputs[0], inputs[1], user.handle);
        } else {
            postComment(slug, content_type, inputs[0], inputs[1]);
        }

        setComment("");

        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('Content.CommentForm.sent')))
    }

    return (
        <div className='centered_content'>
            <h2>{t('content.comments.title')}</h2>
                <FormComponent id="commentForm" onSave={sendComment} options={{saveButtonContent: "Send"}}>
                    <Text name={t('content.comments.username')} value={user?.username} />
                    <RichText name={t('content.comments.comment')} value={comment} />
                </FormComponent>
        </div>
    )
}