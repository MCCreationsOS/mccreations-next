'use client'

import { Suspense, useEffect, useState } from "react"
import CommentCard from "./Comment/CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/types";
import { getUser } from "@/app/api/auth";
import MainButton from "./Buttons/MainButton";

export default function CommentForm({mapSlug}: {mapSlug: string}) {
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [user, setUser] = useState<IUser>()
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

    const sendComment = async () => {
        if(user) {
            postComment(mapSlug, user.username, comment, user.handle);
        } else {
            postComment(mapSlug, username, comment)
        }
    }

    return (
        <div className='centered_content'>
                <form method="none">
                    <h2>Leave a Comment</h2>
                    {(user) ? <></> : 
                        <div className='field'>
                            <p className='label'>Username</p>
                            <input className='input wide' type='text' name='username' placeholder='BeanMiner' onChange={(e) => {setUsername(e.target.value)}}></input>
                        </div>
                        }
                    <div className='field'>
                            <p className='label'>Comment</p>
                            <textarea className='input wide' name='comment' placeholder='Cool project bro!'onChange={(e) => {setComment(e.target.value)}}></textarea>
                    </div>
                    <MainButton onClick={sendComment} >Send!</MainButton>
                    </form>
        </div>
    )
}