'use client'

import { useEffect, useState } from "react"
import { postComment } from "@/app/api/community";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import {useTranslations} from 'next-intl';
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import RichTextInput from "../FormInputs/RichText";
import { FormInput } from "../FormInputs";
import { useUser } from "@/app/api/hooks/users";
import { useComments } from "@/app/api/hooks/comments";
import { ContentTypes, SortOptions } from "@/app/api/types";
import { convertToCollection } from "@/app/api/content";

export default function CommentForm({mapSlug: slug, content_type}: {mapSlug: string, content_type: ContentTypes}) {
    const [comment, setComment] = useState("");
    const collection = convertToCollection(content_type)
    const {comments, setComments} = useComments(slug, collection, SortOptions.Newest, 20)
    const {user} = useUser()
    const [render, setRender] = useState(false);
    const t = useTranslations()

    useEffect(() => {
        if(!navigator.webdriver) {
            setRender(true);
        }
    }, [])

    const sendComment = async (inputs: string[]) => {
        if(inputs[0].length < 3 || (FormInput.getFormInput<string>("comment")?.getValue() ?? "").length < 3) {
            return
        }

        if(user) {
            postComment(slug, content_type, inputs[0], FormInput.getFormInput<string>("comment")?.submit() + "", user.handle);
            setComments([...(comments ?? []), {
                handle: user.handle,
                username: user.username,
                comment: FormInput.getFormInput<string>("comment")?.submit() + "",
                date: Date.now(),
                approved: true,
                slug: slug,
                content_type: collection,
                replies: [],
                likes: 0,
            }])
        } else {
            postComment(slug, content_type, inputs[0], FormInput.getFormInput<string>("comment")?.submit() + "");
            setComments([...(comments ?? []), {
                username: inputs[0],
                comment: FormInput.getFormInput<string>("comment")?.submit() + "",
                date: Date.now(),
                approved: true,
                slug: slug,
                content_type: collection,
                replies: [],
                likes: 0,
            }])
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