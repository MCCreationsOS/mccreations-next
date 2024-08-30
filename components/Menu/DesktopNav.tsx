import Link from "next/link"
import Badge from "../Badge"
import HollowButton from "../Buttons/HollowButton"
import FormComponent from "../Form/Form"
import Tabs from "../Tabs/Tabs"
import { Popup } from "../Popup/Popup"
import UserOptions from "./UserOptions"
import { PopupMessage, PopupMessageType } from "../PopupMessage/PopupMessage"
import { createNewContent, importContent } from "@/app/api/content"
import { useRouter } from "next/navigation"
import Text from "../FormInputs/Text"
import Select from "../FormInputs/Select"
import { useI18n } from "@/locales/client"
import LanguageSwitcher from "../LanguageSwitcher"

/**
 * The navbar displayed when the user is on a desktop device
 * @param selectedPage The currently selected page for menu highlighting 
 * @returns 
 */
export default function DesktopNav({selectedPage}: {selectedPage: string}) {
    const router = useRouter();
    const t = useI18n();

    // Because the Create button/Form Popup is attached to the Menu we need to define the functions here
    const onMapCreate = (title?: string, type?: string, shortDescription?: string) => {
        if(!title) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.create.missing_title')))
        if(!type) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.create.missing_type')))
        if(!shortDescription) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.create.missing_short_description')))

        let token  = sessionStorage.getItem('jwt')
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
        if(link && type) {
            let token = sessionStorage.getItem('jwt')
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
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, t('content.import.missing_link')))
        }
    }

    return (
        <div className="main_nav">
                    <ul className="nav_list">
                        <li className="item brand">
                            <Link href="/" className="brand">
                                <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                                <p className="brand_name">{t('brand')} <Badge color="red">{t('nav.badge.beta')}</Badge></p>
                            </Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'home') ? "link selected" : "link"} href="/">{t('nav.item.home')}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'maps') ? "link selected" : "link"} href="/maps">{t('maps', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'datapacks') ? "link selected" : "link"} href="/datapacks">{t('datapacks', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage == 'resourcepacks') ? "link selected" : "link"} href="/resourcepacks">{t('resourcepacks', {count: 2})}</Link>
                        </li>
                        <li className="item">
                            <Link className={(selectedPage === 'events') ? 'link selected' : 'link fancy'} href="/events/wix-is-over">{t('events')}</Link>
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
                                        title: t('content.create.form_title'), 
                                        content:
                                        <FormComponent id={"createForm"} onSave={(inputs) => {
                                            onMapCreate(inputs[0], inputs[1], inputs[2])
                                        }}>
                                            <Text type="text" name={t('content.create.title')} placeholder={t('content.create.title_placeholder')} />
                                            <Select name={t('content.create.type')} options={[{name: t('maps', { count: 1 }), value: 'map'}, {name: t('datapacks', {count: 1}), value: "datapack"}, {name: t('resourcepacks', {count: 1}), value: 'resourcepack'}]} />
                                            <Text type="text" name={t('content.create.short_description')} />
                                        </FormComponent>
                                    }, 
                                    {
                                        title: t('content.import.form_title'),
                                        content: <>
                                            <p>{t('content.import.description')}</p>
                                            <FormComponent id={"importForm"}
                                            onSave={(inputs) => {
                                                onMapImport(inputs[1], inputs[0])
                                            }}>
                                                <Select name={t('content.import.type')} options={[{name: t('maps', { count: 1 }), value: 'Maps'}, {name: t('datapacks', {count: 1}), value: "datapacks"}, {name: t('resourcepacks', {count: 1}), value: 'resourcepacks'}]} />
                                                <Text type="text" name={t('content.import.link')} placeholder={t('content.import.link_placeholder')} />
                                            </FormComponent>
                                        </>
                                    }
                                ]} />,
                                title: t('content.create.form_title'),
                            }
                            )}}>
                                {t('nav.item.create')}
                            </HollowButton>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                    </ul>
                </div>
    )
}