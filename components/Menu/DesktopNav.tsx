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

export default function DesktopNav({selectedPage}: {selectedPage: string}) {
    const router = useRouter();

    const onMapCreate = (title?: string, type?: string, shortDescription?: string) => {
        if(!title) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A title must be included to save content"))
        if(!type) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A type must be selected to save content"))
        if(!shortDescription) PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A short description must be included to save content"))

        let token  = sessionStorage.getItem('jwt')
        Popup.close()
        createNewContent(title!, type!, shortDescription!, token).then((key) => {
            if(key && 'key' in key) {
                sessionStorage.setItem('temp_key', key.key)
            }
            if('slug' in key) {
                router.push(`/maps/${key.slug}/edit`)
            }
        })
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
                Popup.close()
                router.push('/maps/' + res.content + '/edit')
            }
        } else {
            PopupMessage.addMessage(new PopupMessage(PopupMessageType.Error, "A link must be added to import content"))
        }
    }

    return (
        <div className="main_nav">
                    <ul className="nav_list">
                        <li className="item brand">
                            <Link href="/" className="brand">
                                <img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>
                                <p className="brand_name">MCCreations <Badge color="red">Beta</Badge></p>
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
                            <HollowButton onClick={() => {Popup.createPopup({
                                content: <Tabs tabs={[
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
                                title: "Create",
                            }
                            )}}>
                                Create
                            </HollowButton>
                        </li>
                        <li className='item'>
                            <UserOptions />
                        </li>
                    </ul>
                </div>
    )
}