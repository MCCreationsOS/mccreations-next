'use client'

import { IFile } from "@/app/types"
import FormComponent from "@/components/Form/Form"
import { useCallback, useEffect, useState } from "react"
import styles from './FileDropzone.module.css'
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { ChevronDown } from "react-feather"
import Text from "../Text"
import FileDropzone from "./FileUpload"
import VersionUploader from "."

export default function VersionManager({onVersionsChanged, presetVersions}: {onVersionsChanged: (versions: string) => void, presetVersions?: string}) {
    const [versions, setVersions] = useState<IFile[]>([])
    const [collapsed, setCollapsed] = useState<boolean[]>([])

    useEffect(() => {
        if(versions.length > 0)
            onVersionsChanged(JSON.stringify(versions))
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
                {versions.map((version, idx) => {
                    return (
                        <div key={idx} className={`${styles.version} ${(collapsed[idx]) ? styles.collapsed : ""}`} >
                            <FormComponent id={`file${idx}`} onSave={(inputs) => {
                                let v = [...versions];
                                v[idx] = {
                                    type: v[idx].type,
                                    contentVersion: inputs[0] + "",
                                    minecraftVersion: inputs[1] + "",
                                    worldUrl: inputs[2] + "",
                                    resourceUrl: inputs[3],
                                    dataUrl: inputs[4]
                                }
                                setVersions(v)
                            }} > 
                                <Text type="text" name="Version Number" value={version.contentVersion} />
                                <Text type="text" name="Minecraft Version" value={version.minecraftVersion}/>
                                <VersionUploader name="World" value={version.worldUrl} />
                                <VersionUploader name="Resource Pack" value={version.resourceUrl} />
                                <VersionUploader name="Datapack" value={version.dataUrl} />
                            </FormComponent>
                            <div className={styles.hide_version} onClick={() => {let nc = [...collapsed]; nc[idx] = !nc[idx]; setCollapsed(nc)}}><ChevronDown /></div>
                        </div>
                    )
                })}
                <div>
                    <SecondaryButton onClick={() => {
                        setVersions([...versions, {type: 'map', contentVersion: "", minecraftVersion: "", worldUrl: "", resourceUrl: "", dataUrl: ""}])
                        setCollapsed([...collapsed, false])
                    }}>Add Version</SecondaryButton>
                </div>
            </div>
        </div>
    )
}