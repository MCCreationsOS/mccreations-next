'use client'

import Link from "next/link";
import { Suspense, useState } from "react";
import UserOptions from "./UserOptions";
import PopupComponent, { Popup } from "../Popup/Popup";
import FormComponent from "../Form/Form";
import Tabs from "../Tabs/Tabs";
import { createNewContent, importContent } from "@/app/api/content";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import { useRouter } from "next/navigation";
import HollowButton from "../Buttons/HollowButton";
import Badge from "../Badge";
import DesktopNav from "./DesktopNav";

/**
 * The menu for the site
 * @param selectedPage The currently selected page
 */
export default function Menu({selectedPage}: {selectedPage: string}) {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)

    return (
        <>
            <div className="beta_warning">MCCreations is currently in beta. Please leave any feedback or report any issues using <a href="https://forms.gle/J7HEX9KKbYhQXCii7">this form.</a></div>
            <nav className="nav">
                <DesktopNav selectedPage={selectedPage} />
                <div className="mobile_nav">
                    <div className="icon_align">
                        <img className="menu_icon" src='/menu.svg' alt="" onClick={() => {setMobileMenuActive(true)}}/>
                        <Link href="/" className="brand">
                            <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                            <p className="brand_name">MCCreations <Badge color="red">Beta</Badge></p>
                        </Link>
                    </div>
                    <ul className={(mobileMenuActive) ? "nav_list active" : "nav_list inactive"}>
                        <li className="item">
                            <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">Home</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">Maps</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'datapacks') ? "link selected" : "link"} href="/datapacks">Data Packs</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'resourcepacks') ? "link selected" : "link"} href="/resourcepacks">Resource Packs</Link>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                    </ul>
                    <img className={(mobileMenuActive) ? "menu_icon close_button active" : "menu_icon close_button"} src='/x.svg' alt="" onClick={() => {setMobileMenuActive(false)}} />
                </div>
            </nav>
        </>
    )
}
