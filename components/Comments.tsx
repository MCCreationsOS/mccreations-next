'use client'

import { useEffect, useState } from "react"
import CommentCard from "./cards/CommentCard"
import { postComment } from "@/app/api/community";
import { IComment, IUser } from "@/app/types";
import { getUser } from "@/app/api/auth";

export default function Comments({mapSlug, comments}: {mapSlug: string, comments: IComment[] | undefined}) {
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");
    const [commentsState, setComments] = useState(comments!)
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
            setUsername(user.username );
        }
        
        postComment(mapSlug, username, comment);
        let newComments = commentsState;
        newComments.push({username: username, comment: comment, date: Date.now()})
        console.log(newComments[0])
        setComments(newComments)
    }

    return (
        <div className='centered_content'>
                <form onSubmit={sendComment} method="POST">
                    <h2>Leave a Comment</h2>
                    {(user) ? <></> : <div className='field'>
                                                    <p className='label'>Username</p>
                                                    <input className='input wide' type='text' name='username' placeholder='CrazyCowMM' onChange={(e) => {setUsername(e.target.value)}}></input>
                                                  </div>}
                    <div className='field'>
                            <p className='label'>Comment</p>
                            <textarea className='input wide' name='comment' placeholder='Cool project bro!'onChange={(e) => {setComment(e.target.value)}}></textarea>
                    </div>
                    <button className="main_button" >Send!</button>
                    </form>
                <h2>Comments</h2>
                {(commentsState && commentsState.length > 0 && commentsState[0].comment) ? commentsState.map((comment: IComment, idx: number) => <CommentCard key={idx} comment={comment} />) : <><div className="no_comments"><h3>None Yet!</h3><p>Be the first to comment!</p></div></>}
        </div>
    )
}