'use client'

import Link from "next/link";

export default function Menu({selectedPage}) {

    return (
        <>
            <div id='login'></div>
            <nav className="nav">
                <ul className="nav_list">
                    <li className="item">
                        <p className="brand">MCCreations</p>
                    </li>
                    <li className="item">
                        <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">Home</Link>
                    </li>
                    <li className="item">
                        <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">Maps</Link>
                    </li>
                    <li className="item">
                        {/* <a className="navLink" href="/resourcepacks">Resourcepacks</a> */}
                    </li>
                </ul>
                <ul className='action_list'>
                    <li className='item'>
                        <Link href='https://mccreations.net/submit' className="nav_button">
                            Create
                        </Link>
                    </li>
                    {/* <li className='navItem'>
                        <Link href='/signup' className="navLink">
                            Log In
                        </Link>
                    </li> */}
                </ul>
            </nav>
        </>
    )
}
