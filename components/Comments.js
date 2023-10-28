'use client'

import { useState } from "react"
import CommentCard from "./CommentCard"
import { postComment } from "app/getData";

export default function Comments({mapSlug, comments}) {
    const [username, setUsername] = useState("");
    const [comment, setComment] = useState("");

    const sendComment = async () => {
        console.log(username, comment)
        postComment(mapSlug, username, comment);
    }

    return (
        <div className='commentSection'>
                <form onSubmit={sendComment} method="POST">
                    <h2>Leave a Comment</h2>
                    <div className='accountField'>
                            <p className='commentInputLabel'>Username</p>
                            <input className='commentInput' type='text' name='username' placeholder='CrazyCowMM' onChange={(e) => {setUsername(e.target.value)}}></input>
                    </div>
                    <div className='accountField'>
                            <p className='commentInputLabel'>Comment</p>
                            <textarea className='commentInput' name='comment' placeholder='Cool project bro!'onChange={(e) => {setComment(e.target.value)}}></textarea>
                    </div>
                    <button className="buttonMain" >Send!</button>
                    </form>
                <h2>Comments</h2>
                {(comments) ? comments.map((comment, idx) => <CommentCard key={idx} comment={comment} />) : <></>}
        </div>
    )
}