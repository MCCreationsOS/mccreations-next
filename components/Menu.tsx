'use client'

import Link from "next/link";
import { Suspense, useState } from "react";
import UserOptions from "./UserOptions";

export default function Menu({selectedPage}: {selectedPage: string}) {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)

    return (
        <>
            <div id='login'></div>
            <nav className="nav">
                <div className="main_nav">
                    <ul className="nav_list">
                        <li className="item brand">
                            <Link href="/" className="brand">
                                <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                                <p className="brand_name">MCCreations <span className="badge red">Alpha</span></p>
                            </Link>
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
                        <li className='item'>
                            <UserOptions />
                        </li>
                    </ul>
                </div>
                <div className="mobile_nav">
                    <div className="icon_align">
                        <img className="menu_icon" src='/menu.svg' alt="" onClick={() => {setMobileMenuActive(true)}}/>
                        <img src="/mcc_scaffold_cube.png"></img>
                        <p className="brand">MCCreations <span className="badge red">Alpha</span></p>
                    </div>
                    <ul className={(mobileMenuActive) ? "nav_list active" : "nav_list inactive"}>
                        <li className="item">
                            <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">Home</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">Maps</Link>
                        </li>
                        <li className="item">
                            {/* <a className="navLink" href="/resourcepacks">Resourcepacks</a> */}
                        </li>
                        <li className='item'>
                            <Link href='https://mccreations.net/submit' className="nav_button">
                                Create
                            </Link>
                        </li>
                    </ul>
                    <img className={(mobileMenuActive) ? "menu_icon close_button active" : "menu_icon close_button"} src='/x.svg' alt="" onClick={() => {setMobileMenuActive(false)}} />
                </div>
            </nav>
        </>
    )
}
