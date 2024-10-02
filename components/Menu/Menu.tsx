'use client'

import { Link } from "@/app/api/navigation";
import { Suspense, useRef, useState } from "react";
import UserOptions from "./UserOptions";
import PopupComponent, { Popup } from "../Popup/Popup";
import FormComponent from "../Form/Form";
import Tabs from "../Tabs/Tabs";
import { createNewContent, importContent } from "@/app/api/content";
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage";
import { useRouter } from "next/navigation";
import HollowButton from "../Buttons/HollowButton";
import Badge from "../Badge";
import LanguageSwitcher from "../LanguageSwitcher";
import Text from "../FormInputs/Text"
import Select from "../FormInputs/Select"
import { createDonation } from "@/app/api/payments";
import { useTranslations } from "next-intl";

/**
 * The menu for the site
 * @param selectedPage The currently selected page
 */
export default function Menu({selectedPage}: {selectedPage: string}) {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const uploading = useRef(false)
    const t = useTranslations()
    const router = useRouter();

    const onDonate = async (amount: number) => {
        const url = (await createDonation(amount)).url;
        if(url) {
            router.push(url);
        }
    }

    const onMapCreate = (title?: string, type?: string, shortDescription?: string) => {
        if(!title) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.CreateForm.missing_title')))
        if(!type) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.CreateForm.missing_type')))
        if(!shortDescription) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.CreateForm.missing_short_description')))
    
        let token  = localStorage.getItem('jwt')
        Popup.close()
        createNewContent(title!, type!, shortDescription!, token).then((key) => {
            if(key && 'key' in key) {
                sessionStorage.setItem('temp_key', key.key)
            }
            if('slug' in key) {
                router.push(`/edit/${type}s/${key.slug}`)
            }
            if('error' in key) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, key.error))
            }
        })
    }

    const onMapImport = async (link?: string, type?: string) => {
        if(link && type && !uploading.current) {
            let token = localStorage.getItem('jwt')
            uploading.current = true
            let res = await importContent(link, type, token)
            if(res.error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, res.error))
            } else if(res.content) {
                if(res.key) {
                    sessionStorage.setItem('temp_key', res.key)
                }
                Popup.close()
                router.push(`/edit/${type.toLowerCase()}/${res.content}`)
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('Navigation.ImportForm.missing_link')))
        }
    }
    
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
                            <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">{t('Navigation.home')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">{t('map', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'datapacks') ? "link selected" : "link"} href="/datapacks">{t('datapack', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'resourcepacks') ? "link selected" : "link"} href="/resourcepacks">{t('resourcepack', {count: 2})}</Link>
                        </li>
                    </ul>
                    <ul className='action_list'>
                        <li className="item">
                            <LanguageSwitcher />
                        </li>
                        <li className='item'>
                            <HollowButton onClick={() => {Popup.createPopup({
                                content: <Tabs tabs={[
                                    {
                                        title: t('Navigation.CreateForm.title'), 
                                        content:
                                        <FormComponent id={"createForm"} onSave={(inputs) => {
                                            onMapCreate(inputs[0], inputs[1], inputs[2])
                                        }}>
                                            <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} />
                                            <Select name={t('Navigation.CreateForm.type')} defaultValue="map" options={[{name: t('map', { count: 1 }), value: 'map'}, {name: t('datapack', {count: 1}), value: "datapack"}, {name: t('resourcepack', {count: 1}), value: 'resourcepack'}]} />
                                            <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')}/>
                                        </FormComponent>
                                    }, 
                                    {
                                        title: t('Navigation.ImportForm.title'),
                                        content: <>
                                            <p>{t('Navigation.ImportForm.description')}</p>
                                            <FormComponent id={"importForm"}
                                            onSave={(inputs) => {
                                                onMapImport(inputs[1], inputs[0])
                                            }}>
                                                <Select name={t('Navigation.ImportForm.type')} defaultValue="Maps" options={[{name: t('map', { count: 1 }), value: 'Maps'}, {name: t('datapack', {count: 1}), value: "datapacks"}, {name: t('resourcepack', {count: 1}), value: 'resourcepacks'}]} />
                                                <Text type="text" name={t('Navigation.ImportForm.link')} placeholder={t('Navigation.ImportForm.link_placeholder')} />
                                            </FormComponent>
                                        </>
                                    }
                                ]} />,
                                title: t('Navigation.CreateForm.title'),
                            }
                            )}}>
                                {t('Navigation.CreateForm.title')}
                            </HollowButton>
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
                        <LanguageSwitcher />
                    </div>
                    <ul className={(mobileMenuActive) ? "nav_list active" : "nav_list inactive"}>
                        <li className="item">
                            <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">{t('Navigation.home')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">{t('map', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'datapacks') ? "link selected" : "link"} href="/datapacks">{t('datapack', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'resourcepacks') ? "link selected" : "link"} href="/resourcepacks">{t('resourcepack', {count: 2})}</Link>
                        </li>
                        <li className='item'>
                            <HollowButton onClick={() => {Popup.createPopup({
                                content: <Tabs tabs={[
                                    {
                                        title: t('Navigation.CreateForm.title'), 
                                        content:
                                        <FormComponent id={"createForm"} onSave={(inputs) => {
                                            onMapCreate(inputs[0], inputs[1], inputs[2])
                                        }}>
                                            <Text type="text" name={t('Content.Edit.title')} description={t('Content.Edit.title_description')} />
                                            <Select name={t('Navigation.CreateForm.type')} defaultValue="map" options={[{name: t('map', { count: 1 }), value: 'map'}, {name: t('datapack', {count: 1}), value: "datapack"}, {name: t('resourcepack', {count: 1}), value: 'resourcepack'}]} />
                                            <Text type="text" name={t('Content.Edit.short_description')} description={t('Content.Edit.short_description_description')}/>
                                        </FormComponent>
                                    }, 
                                    {
                                        title: t('Navigation.ImportForm.title'),
                                        content: <>
                                            <p>{t('Navigation.ImportForm.description')}</p>
                                            <FormComponent id={"importForm"}
                                            onSave={(inputs) => {
                                                onMapImport(inputs[1], inputs[0])
                                            }}>
                                                <Select name={t('Navigation.ImportForm.type')} defaultValue="Maps" options={[{name: t('map', { count: 1 }), value: 'Maps'}, {name: t('datapack', {count: 1}), value: "datapacks"}, {name: t('resourcepack', {count: 1}), value: 'resourcepacks'}]} />
                                                <Text type="text" name={t('Navigation.ImportForm.link')} placeholder={t('Navigation.ImportForm.link_placeholder')} />
                                            </FormComponent>
                                        </>
                                    }
                                ]} />,
                                title: t('Navigation.CreateForm.title'),
                            }
                            )}}>
                                {t('Navigation.CreateForm.title')}
                            </HollowButton>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                        
                    </ul>
                    <img className={(mobileMenuActive) ? "menu_icon close_button active" : "menu_icon close_button"} src='/x.svg' alt="" onClick={() => {setMobileMenuActive(false)}} />
                </div>
            </nav>
            {/* <div className="donate">MCCreations costs a lot of money to run, consider donating to keep us alive <SecondaryButton onClick={() => onDonate(5)}>$5</SecondaryButton> <SecondaryButton onClick={() => onDonate(10)}>$10</SecondaryButton> <SecondaryButton onClick={() => onDonate(15)}>$15</SecondaryButton></div> */}
        </>
    )
}
