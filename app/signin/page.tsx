'use client'
import { FacebookAuthProvider, GithubAuthProvider, GoogleAuthProvider, OAuthProvider, signInWithEmailAndPassword, signInWithPopup, signInWithRedirect } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../auth/firebase";
import { SiGithub, SiGoogle } from "@icons-pack/react-simple-icons";
import Link from "next/link";
import { Circle } from "react-feather";

export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const signInWithEmail = () => {
        signInWithEmailAndPassword(auth, email, password).then((credential) => {
            router.push("/")
        })
    }

    const googleProvider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();
    const discordProvider = new OAuthProvider('https://discord.com/oauth2')
    discordProvider.addScope('email');
    discordProvider.addScope('identity');

    const signUpWithGoogle = () => {
        signInWithPopup(auth, googleProvider).then((credential) => {
            // postAccountCreator(credential.user.uid, (credential.user.displayName) ? credential.user.displayName : "MCCreations User");
            router.push("/")
        })
    }

    const signUpWithGithub = () => {
        signInWithPopup(auth, githubProvider).then((credential) => {
            // postAccountCreator(credential.user.uid, (credential.user.displayName) ? credential.user.displayName : "MCCreations User");
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
        <div className="centered_content small popup">
            <h2>Sign In with...</h2>
            <div className="sign_in_providers">
                <div className="provider" onClick={signUpWithGoogle}><SiGoogle /> Google</div>
                {/* <div className="provider" onClick={signInWithDiscord}><SiDiscord />Discord</div> */}
                <div className="provider" onClick={signUpWithGithub}><SiGithub />Github</div>
            </div>
            <h2>Sign In With Email</h2>
            <p>{message}</p>
            <form method="">
                <div className='field'>
                    <p className='label'>Email</p>
                    <input className='input wide' type='text' autoComplete="email" name='email' placeholder='crazycowmm@gmail.com' onChange={(e) => {setEmail(e.target.value)}}></input>
                </div>
                <div className='field'>
                    <p className='label'>Password</p>
                    <input className='input wide' type='password' autoComplete="password" name='password' placeholder='password' onChange={(e) => {setPassword(e.target.value)}}></input>
                </div>
                <button type="button" className="main_button" onClick={signInWithEmail}>Sign in</button>
            </form>
            <div className="sign_up_options">
                <Link href="/signup">Don't have an account?</Link>
                <Link href="/signin/reset" >Forgot your password?</Link>
            </div>
        </div>
    )
}