"use client"

import { Plus } from "lucide-react";
import SecondaryButton from "../Buttons/SecondaryButton";
import styles from './ProfileStyle.module.css'
import { IUser } from "@/app/api/types";
import { Popup } from "../Popup/Popup";
import FormComponent from "../Form/Form";
import Text from "../FormInputs/Text";
import Select from "../FormInputs/Select";
import { ProfileWidgetType } from "./CustomizableProfileArea";
import RichTextInput from "../FormInputs/RichText";
import ImageInput from "../../ImageDropzone";
import { FormInput } from "../FormInputs";
import { useProfileLayoutStore } from "@/app/api/creators";
import { useToken, useUser } from "@/app/api/hooks/users";
export default function AddWidgetButton({creator}: {creator: IUser}) {
    const {user} = useUser()
    const {token} = useToken()
    const {profileLayout, updateProfileLayout} = useProfileLayoutStore(state => state)

    if(user?.handle !== creator.handle) return null

    const chooseWidget = () => {
        Popup.createPopup({
            title: "Add A Widget",
            content: <FormComponent id="add_widget_form" options={{useSaveButton: false}}>
                <Select name="Type" options={[{name: "Showcase", value: "Showcase"}, {name: "Featured Creation", value: "FeaturedCreation"}, {name: "Wall", value: "Wall"}, {name: "Support Site", value: "SupportSite"}, {name: "Text", value: "Text"}, {name: "Image", value: "Image"}, {name: "YouTube", value: "YouTube"}, {name: "Twitch", value: "Twitch"}, {name: "Discord", value: "Discord"}]} onChange={(e) => addWidgetData(e as ProfileWidgetType)}/>
            </FormComponent>
        })
    }

    const addWidgetData = (type: ProfileWidgetType) => {
        let content: React.ReactNode
        switch(type) {
            case "Showcase":
                content = <Select name="Type" options={[{name: "All Creations", value: "content"}, {name: "Maps", value: "Maps"}, {name: "Data Packs", value: "datapacks"}, {name: "Resource Packs", value: "resourcepacks"}]} />
                break
            case "FeaturedCreation":
                content = <><Select name="Type" options={[{name: "Maps", value: "map"}, {name: "Data Packs", value: "datapack"}, {name: "Resource Packs", value: "resourcepack"}]} />
                <Text name="Slug" /></>
                break
            case "Wall":
                break
            case "SupportSite":
                break
            case "Text":
                content = <><Text name="Title" />
                <RichTextInput name="Text" id="text_input"/></>
                break
            case "Image":
                content = <><ImageInput name="Image" />
                <Text name="Title" /></>
                break
            case "YouTube":
                content = <Text name="YouTube Channel"/>
                break
            case "Twitch":
                content = <Text name="Twitch Channel"/>
                break
            case "Discord":
                content = <Text name="Discord Server"/>
                break
        }
        if(content) {
            Popup.createPopup({
                title: "Add A Widget",
                content: <FormComponent id="add_widget_data" onSave={(inputs: string[]) => {
                    switch(type) {
                        case "Showcase":
                            addWidget(type as ProfileWidgetType, {type: inputs[0]})
                            break
                        case "FeaturedCreation":
                            addWidget(type as ProfileWidgetType, {type: inputs[0], slug: inputs[1]})
                            break
                        case "Text":
                            addWidget(type as ProfileWidgetType, {text: FormInput.getFormInput("text_input").submit(), title: inputs[0]})
                            break
                        case "Image":
                            addWidget(type as ProfileWidgetType, {image: JSON.parse(inputs[0])[0].url, title: inputs[1]})
                            break
                        case "YouTube":
                            addWidget(type as ProfileWidgetType, {handle: inputs[0]})
                            break
                        case "Twitch":
                            addWidget(type as ProfileWidgetType, {handle: inputs[0]})
                            break
                        case "Discord":
                            addWidget(type as ProfileWidgetType, {serverId: inputs[0]})
                            break
                    }
                }}>
                    {content}
                </FormComponent>
            })
        } else if(type) {
            addWidget(type as ProfileWidgetType, undefined)
        }
    }

    const addWidget = (type: ProfileWidgetType, data: any) => {
        let layout = profileLayout
        if(!layout) {
            layout = {
                widgets: [],
                layout: []
            }
        }
        layout.widgets.push({
            id: (layout.widgets.length).toString(),
            type: type,
            data: data
        })
        layout.layout.push({
            i: (layout.layout.length).toString(),
            x: 0,
            y: 0,
            w: 12,
            h: 6
        })
        updateProfileLayout(layout, token + "")
    }
    
    return (
        <div className={styles.add_widget_button}>
            <SecondaryButton onClick={chooseWidget}><Plus /> Add Widget</SecondaryButton>
        </div>
    )
}