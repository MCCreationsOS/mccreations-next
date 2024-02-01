'use client'

import Link from "next/link";
import { Suspense, useState } from "react";
import UserOptions from "./UserOptions";
import PopupComponent, { Popup } from "./Popup/Popup";
import FormComponent from "./Form/Form";
import Tabs from "./Tabs/Tabs";
import { createNewContent, importContent } from "@/app/api/content";
import { PopupMessage, PopupMessageType } from "./PopupMessage/PopupMessage";
import { useRouter } from "next/navigation";

export default function Menu({selectedPage}: {selectedPage: string}) {
    const [mobileMenuActive, setMobileMenuActive] = useState(false)
    const router = useRouter();

    const onMapCreate = (title?: string, type?: string, shortDescription?: string) => {
        if(!title) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A title must be included to save content"))
        if(!type) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A type must be selected to save content"))
        if(!shortDescription) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A short description must be included to save content"))

        let creatorStr = sessionStorage.getItem('creator');
        let creator = { username: undefined, handle: undefined }
        if(creatorStr) {
            creator = JSON.parse(creatorStr);
        }

        createNewContent(title!, type!, shortDescription!, creator.username, creator.handle)
    }

    const onMapImport = async (link?: string) => {
        if(link) {
            console.log('Got valid link')
            let token = sessionStorage.getItem('jwt')
            let res = await importContent(link, token)
            console.log('response returned from API')
            console.log(res)
            if(res.error) {
                PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, res.error))
            } else if(res.content) {
                router.push('/maps/' + res.content)
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A link must be added to import content"))
        }
    }

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
                            <div className="nav_button" onClick={() => {Popup.createPopup(
                                <Tabs tabs={[
                                    {
                                        title: "Create", 
                                        content: <FormComponent inputs={[
                                            {type: "text", name: "Title", placeholder: "An Awesome Map"}, 
                                            {type: "select", name: "Type", value: "Map", options: [{name: "Map"}]}, 
                                            {type: "text", name: "Short Description"}
                                        ]} onSave={(inputs) => {
                                            onMapCreate(inputs[0].value, inputs[1].value, inputs[2].value)
                                        }} />
                                    }, 
                                    {
                                        title: "Import",
                                        content: <>
                                            <p>Import your existing content from Planet Minecraft or MinecraftMaps.com below.</p>
                                            <FormComponent inputs={[
                                                {type: "text", name: "Link", placeholder: "https://planetminecraft.com/project/..."}
                                            ]}
                                            onSave={(inputs) => {
                                                onMapImport(inputs[0].value)
                                            }}></FormComponent>
                                        </>
                                    }
                                ]} />,
                                 "Create"
                            )}}>
                                Create
                            </div>
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
                            <p className="brand_name">MCCreations <span className="badge red">Alpha</span></p>
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
                            {/* <a className="navLink" href="/resourcepacks">Resourcepacks</a> */}
                        </li>
                        <li className='item'>
                            <div className="nav_button" onClick={() => {Popup.createPopup(<FormComponent inputs={[{type: "text", name: "Title", placeholder: "An Awesome Map"}, {type: "select", name: "Type", value: "Map", options: [{name: "Map"}]}, {type: "text", name: "Short Description"}]} onSave={() => {}} />, "Create")}}>
                                Create
                            </div>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                    </ul>
                    <img className={(mobileMenuActive) ? "menu_icon close_button active" : "menu_icon close_button"} src='/x.svg' alt="" onClick={() => {setMobileMenuActive(false)}} />
                </div>
            </nav>
            <PopupComponent />
        </>
    )
}
