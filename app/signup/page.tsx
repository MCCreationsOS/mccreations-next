'use client'
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { Suspense, useState } from "react";
import { auth } from "../auth/firebase";
import { postAccountCreator } from "../getData";
import { useRouter } from "next/navigation";
import { SiDiscord, SiFacebook, SiGithub, SiGoogle } from '@icons-pack/react-simple-icons'
import Link from "next/link";
import MapScroll from "@/components/MapScroll";

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const signUpWithEmail = () => {
        createUserWithEmailAndPassword(auth, email, password).then((credential) => {
            postAccountCreator(credential.user.uid, username);
            router.push("/");
        }).catch((e) => {
            if(e.code === "auth/email-already-in-use") {
                signInWithEmailAndPassword(auth, email, password).then(() => {
                    router.push("/");
                }).catch((e) => {
                    setMessage("Email already in use!")
                })
            } else {
                setMessage(e.message)
            }
        })
    }

    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const discordProvider = new OAuthProvider('oidc.discord')
    discordProvider.addScope('identify');
    discordProvider.setCustomParameters({
        prompt: "consent"
    })

    const signUpWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then((credential) => {
            postAccountCreator(credential.user.uid, (credential.user.displayName) ? credential.user.displayName : "MCCreations User");
            router.push("/")
        })
    }

    const signUpWithGithub = () => {
        signInWithPopup(auth, githubProvider).then((credential) => {
            postAccountCreator(credential.user.uid, (credential.user.displayName) ? credential.user.displayName : "MCCreations User");
            router.push("/")
        })
    }

    const signInWithDiscord = () => {
        signInWithPopup(auth, discordProvider).then((credential) => {
            // postAccountCreator(credential.user.uid, (credential.user.displayName) ? credential.user.displayName : "MCCreations User");
            router.push("/")
        })
    }

    return (
        <div className="popup_page">
            <Suspense>
                <MapScroll />
            </Suspense>
             <div className="centered_content small popup">
                <h2>Sign In With</h2>
                <div className="sign_in_providers">
                    <div className="provider" onClick={signUpWithGoogle}><SiGoogle /> Google</div>
                    {/* <div className="provider" onClick={signInWithDiscord}><SiDiscord />Discord</div> */}
                    <div className="provider" onClick={signUpWithGithub}><SiGithub />Github</div>
                </div>
                <h2>Or Sign Up</h2>
                {(message) ? <p>{message}</p>: <></>}
                <form method="">
                    <div className='field'>
                        <p className='label'>Username</p>
                        <input className='input wide' type='text' autoComplete="username" name='username' placeholder='CrazyCowMM' onChange={(e) => {setUsername(e.target.value)}}></input>
                    </div>
                    <div className='field'>
                        <p className='label'>Email</p>
                        <input className='input wide' type='text' autoComplete="email" name='email' placeholder='crazycowmm@gmail.com' onChange={(e) => {setEmail(e.target.value)}}></input>
                    </div>
                    <div className='field'>
                        <p className='label'>Password</p>
                        <input className='input wide' type='password' autoComplete="password" name='password' placeholder='password' onChange={(e) => {setPassword(e.target.value)}}></input>
                    </div>
                    <button type="button" className="main_button" onClick={signUpWithEmail}>Sign up</button>
                </form>
                <div className="sign_up_options">
                    <Link href="/signin">Already have an account?</Link>
                    <Link href="/signin/reset" >Forgot your password?</Link>
                </div>
            </div>
        </div>
       
    )
}