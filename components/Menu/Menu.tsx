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
import { I18nProviderClient, useI18n } from "@/locales/client";
import LanguageSwitcher from "../LanguageSwitcher";
import SecondaryButton from "../Buttons/SecondaryButton";
import IconButton from "../Buttons/IconButton";
import { X } from "react-feather";
import { createDonation } from "@/app/api/payments";

/**
 * The menu for the site
 * @param selectedPage The currently selected page
 */
export default function Menu({selectedPage}: {selectedPage: string}) {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const t = useI18n();
    const router = useRouter();

    const onDonate = async (amount: number) => {
        const url = (await createDonation(amount)).url;
        if(url) {
            router.push(url);
        }
    }
    
    return (
        <>
            <div className="beta_warning">{t('nav.beta_warning1')}<a href="https://forms.gle/J7HEX9KKbYhQXCii7">{t('nav.beta_warning2')}</a></div>
            <nav className="nav">
                <DesktopNav selectedPage={selectedPage} />
                <div className="mobile_nav">
                    <div className="icon_align">
                        <img className="menu_icon" src='/menu.svg' alt="" onClick={() => {setMobileMenuActive(true)}}/>
                        <Link href="/" className="brand">
                            <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                            <p className="brand_name">{t('brand')}<Badge color="red">{t('nav.badge.beta')}</Badge></p>
                        </Link>
                        <Link href="/events/wix-is-over" className="link fancy">
                            {t('events')}
                        </Link>
                    </div>
                    <ul className={(mobileMenuActive) ? "nav_list active" : "nav_list inactive"}>
                        <li className="item">
                            <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">{t('nav.item.home')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">{t('nav.item.maps')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'datapacks') ? "link selected" : "link"} href="/datapacks">{t('nav.item.datapacks')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'resourcepacks') ? "link selected" : "link"} href="/resourcepacks">{t('nav.item.resourcepacks')}</Link>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                        <li className="item">
                            <LanguageSwitcher />
                        </li>
                    </ul>
                    <img className={(mobileMenuActive) ? "menu_icon close_button active" : "menu_icon close_button"} src='/x.svg' alt="" onClick={() => {setMobileMenuActive(false)}} />
                </div>
            </nav>
            <div className="donate">MCCreations costs a lot of money to run, consider donating to keep us alive <SecondaryButton onClick={() => onDonate(5)}>$5</SecondaryButton> <SecondaryButton onClick={() => onDonate(10)}>$10</SecondaryButton> <SecondaryButton onClick={() => onDonate(15)}>$15</SecondaryButton></div>
        </>
    )
}
