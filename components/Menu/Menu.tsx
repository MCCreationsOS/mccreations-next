'use client'

import { Link } from "@/app/api/navigation";
import { Suspense, useRef, useState } from "react";
import UserOptions from "./UserOptions";
import PopupComponent, { Popup } from "../Popup/Popup";
import FormComponent from "../Form/Form";
import Tabs from "../Tabs/Tabs";
import { createNewContent, importContent } from "@/app/api/content";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import { useRouter, usePathname } from "next/navigation";
import HollowButton from "../Buttons/HollowButton";
import Badge from "../Badge";
import LanguageSwitcher from "../LanguageSwitcher";
import Text from "../FormInputs/Text"
import Select from "../FormInputs/Select"
import { createDonation } from "@/app/api/payments";
import { useTranslations } from "next-intl";
import DropDown, { DropDownItem } from "../FormInputs/RichText/DropDown";
import { DownloadCloud, Layers, Map, Package, Upload } from "react-feather";

export default function Menu() {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const t = useTranslations()
    const router = useRouter();
    const pathname = usePathname()
    
    return (
        <>
            <div className="beta_warning">{t.rich('Navigation.beta_warning', {
                form: (chunks) => <Link href="https://forms.gle/J7HEX9KKbYhQXCii7">{chunks}</Link>,
                link: (chunks) => <Link href="https://discord.com/invite/HQSnKGf">{chunks}</Link>,
                github: (chunks) => <Link href="https://github.com/MCCreationsOS">{chunks}</Link>
                })}</div>
            <nav className="nav">
                <div className="main_nav">
                    <ul className="nav_list">
                        <li className="item brand">
                            <Link href="/" className="brand">
                                <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                                <p className="brand_name">{t('brand')} <Badge color="red">{t('Navigation.badge')}</Badge></p>
                            </Link>
                        </li>
                        <li className="item">
                            <Link className={(pathname.includes('/feed')) ? "link selected" : "link"} href="/feed">{t('Navigation.feed')}</Link>
                        </li>
                        <li className="item">
                            <DropDown buttonLabel={t('Navigation.creations')} buttonClassName={(pathname.includes('/maps')) ? "link selected" : "link"} openOnHover={true} className="option_dropdown" useButtonWidth={false}>
                                <DropDownItem onClick={() => {router.push('/maps')}} className="option_button"><Link className="dropdown_link" href="/maps"><Map />{t('map', {count: 2})}</Link></DropDownItem>
                                <DropDownItem onClick={() => {router.push('/datapacks')}} className="option_button"><Link className="dropdown_link" href="/datapacks"><Package />{t('datapack', {count: 2})}</Link></DropDownItem>
                                <DropDownItem onClick={() => {router.push('/resourcepacks')}} className="option_button"><Link className="dropdown_link" href="/resourcepacks"><Layers />{t('resourcepack', {count: 2})}</Link></DropDownItem>
                            </DropDown>
                        </li>
                        {/* <li className="item">
                            <Link className={(pathname.includes('/marketplace')) ? "link selected" : "link"} href="/marketplace">{t('Navigation.marketplace')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(pathname.includes('/forums')) ? "link selected" : "link"} href="/forums">{t('Navigation.forums')}</Link>
                        </li> */}
                    </ul>
                    <ul className='action_list'>
                        <li className="item">
                            <LanguageSwitcher />
                        </li>
                        <li className='item'>
                            <DropDown buttonLabel={t('Navigation.create')} buttonClassName="create_dropdown" className="option_dropdown" useButtonWidth={true}>
                                <DropDownItem className="option_button" onClick={() => {router.push("/create")}}><Link className="dropdown_link" href="/create"><Upload/> Upload</Link></DropDownItem>
                                <DropDownItem className="option_button" onClick={() => {router.push("/create/import")}}><Link className="dropdown_link" href="/create/import"><DownloadCloud/> Import</Link></DropDownItem>
                            </DropDown>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                    </ul>
                </div>
                <div className="mobile_nav">
                    <div className="icon_align">
                        <img className="menu_icon" src='/menu.svg' alt="" onClick={() => {setMobileMenuActive(true)}}/>
                        <Link href="/" className="brand">
                            <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                            <p className="brand_name">{t('brand')}<Badge color="red">{t('Navigation.badge')}</Badge></p>
                        </Link>
                    </div>
                    <ul className="action_list">
                        <li className="action_item">
                            <LanguageSwitcher />
                        </li>
                        <li className="action_item">
                            <UserOptions />
                        </li>
                    </ul>
                    <ul className={(mobileMenuActive) ? "nav_list active" : "nav_list inactive"}>
                        <li className="item">
                            <Link className={(pathname === '/') ? "link selected" : "link"} href="/" onClick={() => {setMobileMenuActive(false)}}>{t('Navigation.home')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(pathname.includes('/feed')) ? "link selected" : "link"} href="/feed" onClick={() => {setMobileMenuActive(false)}}>{t('Navigation.feed')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(pathname.includes('/maps')) ? "link selected" : "link"} href="/maps" onClick={() => {setMobileMenuActive(false)}}>{t('map', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(pathname.includes('/datapacks')) ? "link selected" : "link"} href="/datapacks" onClick={() => {setMobileMenuActive(false)}}>{t('datapack', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(pathname.includes('/resourcepacks')) ? "link selected" : "link"} href="/resourcepacks" onClick={() => {setMobileMenuActive(false)}}>{t('resourcepack', {count: 2})}</Link>
                        </li>
                        <li className='item'>
                            <DropDown buttonLabel={t('Navigation.create')} buttonClassName="link" className="option_dropdown" useButtonWidth={true}>
                                <DropDownItem className="option_button" onClick={() => {}}><Link className="dropdown_link" href="/create"><Upload/> Upload</Link></DropDownItem>
                                <DropDownItem className="option_button" onClick={() => {}}><Link className="dropdown_link" href="/create/import"><DownloadCloud/> Import</Link></DropDownItem>
                            </DropDown>
                        </li>
                        
                    </ul>
                    <img className={(mobileMenuActive) ? "menu_icon close_button active" : "menu_icon close_button"} src='/x.svg' alt="" onClick={() => {setMobileMenuActive(false)}} />
                </div>
            </nav>
            {/* <div className="donate">MCCreations costs a lot of money to run, consider donating to keep us alive <SecondaryButton onClick={() => onDonate(5)}>$5</SecondaryButton> <SecondaryButton onClick={() => onDonate(10)}>$10</SecondaryButton> <SecondaryButton onClick={() => onDonate(15)}>$15</SecondaryButton></div> */}
        </>
    )
}
