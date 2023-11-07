'use client'

import React from "react"
import signIn from "app/firebase/auth/signin"
import { useRouter } from "next/navigation"
import Menu from "@components/Menu";
import Link from "next/link";

export default function SignIn() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    const handleForm = async (event) => {
        event.preventDefault();

        const {result, error} = await (signIn(email, password));

        if(error) {
            return console.log(error);
        }

        router.push('/')

        console.log(result);
    }

    return (
        <>
        <Menu></Menu>
            <div className='popup'>
                <div className='accountForm'>
                    <h1 className="accountHeader">Log In!</h1>
                    <hr className="accountBreaker"></hr>
                    <form onSubmit={handleForm}>
                        <div className='accountField'>
                            <label htmlFor="email">
                                <p className='accountLabel'>Email</p>
                                <input className='accountInput' onChange={(e) => setEmail(e.target.value)} required type='email' name='email' id='email' placeholder='creator@mccreations.net'></input>
                            </label>
                        </div>
                        <div className='accountField'>
                            <label htmlFor="password">
                                <p className='accountLabel'>Password</p>
                                <input className='accountInput' onChange={(e) => setPassword(e.target.value)} required type='password' name='password' id='password'></input>
                            </label>
                        </div>
                        <div className='accountCentered'>
                            <button className="accountConfirmButton" type='submit'>Sign in</button><br></br>
                            <Link href='/signup'>Create an Account</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}