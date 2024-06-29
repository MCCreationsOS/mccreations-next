'use client'

import { ContentTypes, IFile } from "@/app/types"
import FormComponent from "@/components/Form/Form"
import { useCallback, useEffect, useState } from "react"
import styles from './FileDropzone.module.css'
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { ChevronDown, Trash } from "react-feather"
import Text from "../Text"
import FileDropzone from "./FileUpload"
import VersionUploader from "."
import WarningButton from "@/components/Buttons/WarningButton"

export default function VersionManager({onVersionsChanged, contentType, presetVersions}: {onVersionsChanged: (versions: string) => void, contentType: ContentTypes, presetVersions?: string}) {
    const [versions, setVersions] = useState<IFile[]>([])
    const [collapsed, setCollapsed] = useState<boolean[]>([])

    useEffect(() => {
        if(versions.length > 0) {
            onVersionsChanged(JSON.stringify(versions))
            setCollapsed(versions.map((v, idx) => idx !== 0))
        }
    }, [versions])

    useEffect(() => {
        if(presetVersions) {
            setVersions(JSON.parse(presetVersions))
        }
    }, [])

    return (
        <div>
            <h2>Manage Versions</h2>
            <div>
                <div>
                    <SecondaryButton onClick={() => {
                        setVersions([...versions, {type: 'map', contentVersion: "", minecraftVersion: "", worldUrl: "", resourceUrl: "", dataUrl: ""}, ])
                        setCollapsed([...collapsed, false, ])
                    }}>Add Version</SecondaryButton>
                </div>
                {versions.map((version, idx) => {
                    return (
                        <div key={idx} className={`${styles.version} ${(collapsed[idx]) ? styles.collapsed : ""}`} >
                            <FormComponent id={`file${idx}`} onSave={(inputs) => {
                                let v = [...versions];
                                let worldUrl = inputs[2];
                                let resourceUrl = inputs[4]
                                let dataUrl = inputs[6]
                                if(!worldUrl) {
                                    worldUrl = inputs[3]
                                }
                                if(!resourceUrl) {
                                    resourceUrl = inputs[5]
                                }
                                if(!dataUrl) {
                                    dataUrl = inputs[7]
                                }
                                console.log(inputs)
                                v[idx] = {
                                    type: v[idx].type,
                                    contentVersion: inputs[0] + "",
                                    minecraftVersion: inputs[1] + "",
                                    worldUrl: worldUrl + "",
                                    resourceUrl: resourceUrl + "",
                                    dataUrl: dataUrl + ""
                                }
                                setVersions(v)
                            }} > 
                                <Text type="text" name="Version Number" value={version.contentVersion} />
                                <Text type="text" name="Minecraft Version" value={version.minecraftVersion}/>
                                {(contentType === ContentTypes.Maps) ? (<VersionUploader name="World" value={version.worldUrl} />): <></>}
                                {(contentType === ContentTypes.Datapacks || contentType === ContentTypes.Maps) ? (<VersionUploader name="Datapack" value={version.dataUrl} />): <></>}
                                <VersionUploader name="Resource Pack" value={version.resourceUrl} />
                            </FormComponent>
                            <WarningButton onClick={() => {setVersions(versions.filter((v, i) => {return i !== idx}))}}>Delete</WarningButton>
                            <div className={`${styles.hide_version} ${(collapsed[idx]) ? styles.hide_reversed : ""}`} onClick={() => {let nc = [...collapsed]; nc[idx] = !nc[idx]; setCollapsed(nc)}}><ChevronDown /></div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}