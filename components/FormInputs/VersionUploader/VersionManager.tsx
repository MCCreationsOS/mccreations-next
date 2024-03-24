'use client'

import { IFile } from "@/app/types"
import FormComponent from "@/components/Form/Form"
import { useCallback, useEffect, useState } from "react"
import styles from './FileDropzone.module.css'
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { ChevronDown } from "react-feather"

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
                            <FormComponent inputs={[
                                {
                                    name: "Version Number",
                                    type: "text",
                                    value: version.contentVersion
                                },
                                {
                                    name: "Minecraft Version",
                                    type: "text",
                                    value: version.minecraftVersion
                                },
                                {
                                    name: "World",
                                    type: 'file',
                                    value: version.worldUrl
                                },
                                {
                                    name: "Resource Pack",
                                    type: 'file',
                                    value: version.resourceUrl
                                },
                                {
                                    name: "Datapack",
                                    type: 'file',
                                    value: version.dataUrl
                                }
                            ]} onSave={(inputs) => {
                                let v = [...versions];
                                v[idx] = {
                                    type: v[idx].type,
                                    contentVersion: inputs[0].value + "",
                                    minecraftVersion: inputs[1].value + "",
                                    worldUrl: inputs[2].value + "",
                                    resourceUrl: inputs[3].value,
                                    dataUrl: inputs[4].value
                                }
                                setVersions(v)
                            }} />
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