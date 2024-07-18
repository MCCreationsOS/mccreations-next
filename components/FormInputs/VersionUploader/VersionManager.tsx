'use client'

import { ContentTypes, IFile } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import { useCallback, useEffect, useState } from "react"
import styles from './FileDropzone.module.css'
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { ChevronDown, Trash } from "react-feather"
import Text from "../Text"
import FileDropzone from "./FileUpload"
import VersionUploader from "."
import WarningButton from "@/components/Buttons/WarningButton"
import { useI18n } from "@/locales/client"
import { Popup } from "@/components/Popup/Popup"

export default function VersionManager({onVersionsChanged, contentType, presetVersions}: {onVersionsChanged: (versions: string) => void, contentType: ContentTypes, presetVersions?: string}) {
    const [versions, setVersions] = useState<IFile[]>([])
    const t = useI18n();

    useEffect(() => {
        if(versions && versions.length > 0) {
            onVersionsChanged(JSON.stringify(versions))
        }
    }, [versions])

    useEffect(() => {
        if(presetVersions) {
            setVersions(JSON.parse(presetVersions))
        }
    }, [])

    return (
        <div>
            <h2>{t('form.versions.manage_versions')}</h2>
            <div>
                <div>
                    <SecondaryButton onClick={() => {
                        let newVersions = (versions) ? [...versions] : []
                        newVersions.push({type: 'map', contentVersion: "0.0.1", minecraftVersion: "", worldUrl: "", resourceUrl: "", dataUrl: ""})
                        setVersions(newVersions)
                    }}>{t('form.versions.add_version')}</SecondaryButton>
                </div>
                <div className={styles.versions}>
                {versions && versions.map((version, idx) => {
                    return (
                            <SecondaryButton onClick={() => {
                                Popup.createPopup({
                                    content: <FormComponent id={`file${idx}`} onSave={(inputs) => {
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
                                        v[idx] = {
                                            type: v[idx].type,
                                            contentVersion: inputs[0] + "",
                                            minecraftVersion: inputs[1] + "",
                                            worldUrl: worldUrl + "",
                                            resourceUrl: resourceUrl + "",
                                            dataUrl: dataUrl + ""
                                        }
                                        setVersions(v)
                                        Popup.close()
                                    }} options={{useSaveButton: true, saveButtonContent: t('form.versions.save_version'), extraButtons: [<WarningButton onClick={() => {setVersions(versions.filter((v, i) => {return i !== idx})); Popup.close()}}>{t('form.versions.delete')}</WarningButton>]}}> 
                                        <Text type="text" name={t('form.versions.version_number')} value={version.contentVersion} />
                                        <Text type="text" name={t('form.versions.minecraft_version')} value={version.minecraftVersion}/>
                                        <div className={styles.files}>
                                            {(contentType === ContentTypes.Maps) ? (<VersionUploader name={t('maps', {count: 1})} value={version.worldUrl} />): <></>}
                                            {(contentType === ContentTypes.Datapacks || contentType === ContentTypes.Maps) ? (<VersionUploader name={t('datapacks', {count: 1})} value={version.dataUrl} />): <></>}
                                            <VersionUploader name={t('resourcepacks', {count: 1})} value={version.resourceUrl} />
                                        </div>
                                    </FormComponent>,
                                    title: t('form.versions.edit_version')
                                })
                            }}>{version.contentVersion}</SecondaryButton>
                    )
                })}
                </div>
            </div>
        </div>
    )
}