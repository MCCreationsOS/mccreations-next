'use client'

import { Suspense, useEffect, useState } from "react"
import CommentCard from "./CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/api/types";
import { getUser, useUserStore } from "@/app/api/auth";
import MainButton from "../Buttons/MainButton";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import RichText from "../FormInputs/RichText";
import {useTranslations} from 'next-intl';
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import RichTextInput from "../FormInputs/RichText";
import { FormInput } from "../FormInputs";
import { useUser } from "@/app/api/hooks/users";

export default function CommentForm({mapSlug: slug, content_type}: {mapSlug: string, content_type: string}) {
    const [comment, setComment] = useState("");
    const {user} = useUser()
    const [render, setRender] = useState(false);
    const t = useTranslations()
    let token;

    useEffect(() => {
        if(!navigator.webdriver) {
            setRender(true);
        }
    }, [])

    const sendComment = async (inputs: string[]) => {
        if(user) {
            postComment(slug, content_type, inputs[0], FormInput.getFormInput<string>("comment")?.submit() + "", user.handle);
        } else {
            postComment(slug, content_type, inputs[0], FormInput.getFormInput<string>("comment")?.submit() + "");
        }

        FormInput.getFormInput<string>("comment")?.clear()

        setComment("");

        PopupMessage.addMessage(new PopupMessage(PopupMessageType.Alert, t('CommentForm.sent')))
    }

    if(!render) return;

    return (
        <div className='centered_content'>
            <h2>{t('CommentForm.title')}</h2>
                <FormComponent id="commentForm" onSave={sendComment} options={{saveButtonContent: t('CommentForm.send')}}>
                    <Text name={t('Account.Shared.username')} placeholder={t('Account.Shared.username_placeholder')} value={user?.username} />
                    <RichTextInput id="comment" name={t('CommentForm.comment')} value={comment}/>
                </FormComponent>
        </div>
    )
}