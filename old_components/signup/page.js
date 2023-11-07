'use client'

import React from "react"
import signUp from "app/firebase/auth/signup"
import { useRouter } from "next/navigation"
import Menu from "@components/Menu"
import Link from "next/link"

export default function SignUp() {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter;

    const handleForm = async (event) => {
        event.preventDefault();

        const {result, error} = await (signUp(email, password, username));

        if(error) {
            return console.log(error);
        }

        console.log(result);
    }
    return (
        <>
        <Menu></Menu>
            <div className='popup'>
                <div className='accountForm'>
                    <h1 className="accountHeader">Sign up!</h1>
                    <hr className="accountBreaker"></hr>
                    <form onSubmit={handleForm}>
                    <div className='accountField'>
                            <label htmlFor="username">
                                <p className='accountLabel'>Username</p>
                                <input className='accountInput' onChange={(e) => setUsername(e.target.value)} required type='text' name='username' id='username' placeholder='TheAwesomeCreator'></input>
                            </label>
                        </div>
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
                            <button className="accountConfirmButton" type='submit'>Sign Up</button><br></br>
                            <Link href='/login'>Already have an account?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}