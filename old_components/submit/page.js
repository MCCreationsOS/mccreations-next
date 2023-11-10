'use client'
import Menu from 'components/Menu'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Submit from 'app/contentful/submit'
import { AuthContext, useAuthContext } from "app/context/AuthContext"
import { v4 as uuidv4 } from 'uuid'

function makeUrl(string) {
    string.toLowerCase();
    string.replaceAll(" ", "-")
    string.replaceAll("'", "")
    return encodeURI(string);
}

export default function Page() {
    const [title, setTitle] = useState("")
    const [type, setType] = useState("")
    const [summary, setSummary] = useState("");

    const { user } = useAuthContext();
    const router = useRouter();

    const submit = async () => {
        let entry = {
            fields: {
                title: {
                    'en-US': title
                },
                contentType: {
                    'en-US': type
                },
                summary: {
                    'en-US': summary
                },
                slug: {
                    'en-US': makeUrl(title)
                },
                accessKey: {
                    'en-US': ''
                },
                createdDate: {
                    'en-US': Date.now()
                }
            }
        }

        if(user == null) {
            let nonUserAccessKey = uuidv4();
            sessionStorage.setItem('tempAccessKey', nonUserAccessKey);
            entry.fields.accessKey['en-US'] = nonUserAccessKey;
        } else {
            entry.fields.accessKey['en-US'] = user.getToken();
        }

        await Submit(entry);
        
        router.push(`/maps/${makeUrl(title)}`)
    }

    return (
        <>
        <Menu></Menu>
        <div className="popup">
            <h2>Submit a Creation</h2>
            <hr></hr>
            <div className='accountField'>
                <label htmlFor="title">
                    <p className='accountLabel'>Title</p>
                    <input className='accountInput' type='text' name='title' placeholder='Title' onChange={(e) => {setTitle(e.target.value)}}></input>
                </label>
            </div>
            <div className='accountField'>
                <label htmlFor="contentType">
                    <p className='accountLabel'>Content Type</p>
                    <button type='button' onClick={() => setType("Map")}>Map</button>
                    <button type='button' onClick={() => setType("Datapack")}>Datapack</button>
                    <button type='button' onClick={() => setType("Resourcepack")}>Resourcepack</button>
                </label>
            </div>
            <div className='accountField'>
                <label htmlFor="summary">
                    <p className='accountLabel'>Summary</p>
                    <textarea className='accountInput' name='summary' placeholder='Cool project bro!' onChange={(e) => {setSummary(e.target.value)}}></textarea>
                </label>
            </div>
            <div className='accountCentered'>
                <button className="accountConfirmButton" onClick={submit}>Submit</button>
            </div>
        </div>
        </>
    )
}