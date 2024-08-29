'use client'

import { CollectionNames, ContentTypes, IFile } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import { useCallback, useEffect, useState } from "react"
import styles from './FileDropzone.module.css'
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { ArrowLeft, ChevronDown, Trash } from "react-feather"
import Text from "../Text"
import FileDropzone from "./FileUpload"
import VersionUploader from "."
import WarningButton from "@/components/Buttons/WarningButton"
import { useI18n } from "@/locales/client"
import { Popup } from "@/components/Popup/Popup"
import Select from "../Select"
import Checkbox from "../Checkbox"

export default function VersionManager({ onVersionsChanged, contentType, presetVersions }: { onVersionsChanged: (versions: string) => void, contentType: CollectionNames, presetVersions?: string }) {
    const [versions, setVersions] = useState<IFile[]>([])
    const [renderVersion, setRenderVersion] = useState<IFile>()
    const [idx, setIdx] = useState(0)
    const t = useI18n();

    useEffect(() => {
        if (versions) {
            onVersionsChanged(JSON.stringify(versions))
        }
    }, [versions])

    useEffect(() => {
        if (presetVersions) {
            setVersions(JSON.parse(presetVersions))
        }
    }, [])

    useEffect(() => {
        setIdx(versions.indexOf(renderVersion!))
    }, [renderVersion])

    if (renderVersion) {
        return (<div>
            <h2>{t('VersionManager.Version.edit')}</h2>
            <SecondaryButton className={styles.button_icon_aligned} onClick={() => {setRenderVersion(undefined)}}><ArrowLeft />{t('VersionManager.Versions.back_to_versions')}</SecondaryButton>
            <FormComponent id={`version_${idx}`} onSave={(inputs) => {
                const contentVersion = inputs[0]
                const minecraftVersion = inputs[1]
                const url = inputs[2]
                const extraFiles = []
                for (let i = 3; i < inputs.length; i += 3) {
                    extraFiles.push({ type: inputs[i], url: inputs[i + 1], required: Boolean(inputs[i + 2]) })
                }
                let v: IFile = { ...renderVersion! };
                v.contentVersion = contentVersion
                v.minecraftVersion = minecraftVersion
                v.url = url
                v.extraFiles = extraFiles
                let vs = [...versions]
                vs[idx] = v
                setVersions(vs)
            }} options={{ useSaveButton: true, saveButtonContent: t('VersionManager.Version.save'), extraButtons: [<SecondaryButton onClick={() => { setRenderVersion(undefined) }}>{t('VersionManager.Version.cancel')}</SecondaryButton>, <WarningButton onClick={() => {
                let vs = [...versions]
                vs.splice(idx, 1)
                setVersions(vs)
                setRenderVersion(undefined)
            }}>{t('VersionManager.Version.delete')}</WarningButton>] }}>
                <Text type="text" name={t('VersionManager.Version.version_number')} value={renderVersion.contentVersion} />
                <Text type="text" name={t('VersionManager.Version.minecraft_version')} value={renderVersion.minecraftVersion} />
                <Text type="text" name={t('VersionManager.Version.MainFile.link')} value={renderVersion?.worldUrl ?? renderVersion?.resourceUrl ?? renderVersion?.dataUrl ?? renderVersion?.url} />
                {renderVersion?.extraFiles && renderVersion?.extraFiles.map((file, idx) => {
                    return <div>
                        <Select name={t('VersionManager.Version.ExtraFiles.file_type')} options={[{ value: ContentTypes.Maps, name: t('maps', {count: 1}) }, { value: ContentTypes.Datapacks, name: t('datapacks', {count: 1}) }, { value: ContentTypes.Resourcepacks, name: t('resourcepacks', {count: 1}) }]} value={file.type} />
                        <Text type="text" name={t('VersionManager.Version.ExtraFiles.link')} value={file.url} />
                        <Checkbox name={t('VersionManager.Version.ExtraFiles.required')} value={file.required.toString()} />
                    </div>
                })}
                <SecondaryButton className={styles.add_file_button} onClick={() => {
                    Popup.createPopup({
                        content: <FormComponent id={`file${renderVersion?.extraFiles?.length}`} onSave={(inputs) => {
                            let v: IFile = { ...renderVersion! };
                            if (!v?.extraFiles) {
                                v!.extraFiles = []
                            }
                            v?.extraFiles.push({ type: "map", url: inputs[1], required: false })
                            let vs = [...versions]
                            vs[idx] = v
                            setVersions(vs)
                            Popup.close()
                        }} options={{ useSaveButton: true, saveButtonContent: t('VersionManager.Version.ExtraFiles.upload_file') }}>
                            <VersionUploader name="" />
                        </FormComponent>,
                        title: t('VersionManager.Version.add_file')
                    })
                }}>{t('VersionManager.Version.add_file')}</SecondaryButton>
            </FormComponent>
        </div>)
    }

    return (
        <div>
            <h2>{t('VersionManager.title')}</h2>
            <div>
                <div>
                    <SecondaryButton onClick={() => {
                        Popup.createPopup({
                            content: <FormComponent id={`version_${versions.length}`} onSave={(inputs) => {
                                let newVersions = (versions) ? [...versions] : []
                                newVersions.push({ type: contentType, contentVersion: "1.0.0", minecraftVersion: "", url: inputs[0]})
                                setVersions(newVersions)
                                Popup.close()
                            }}>
                                <VersionUploader name="" />
                            </FormComponent>,
                            title: t('VersionManager.add_version')
                        })
                    }}>{t('VersionManager.add_version')}</SecondaryButton>
                </div>
                <div className={styles.versions}>
                    {versions && versions.map((version, idx) => {
                        return (
                            <SecondaryButton onClick={() => {
                                setRenderVersion(version)
                            }}>{version.contentVersion}</SecondaryButton>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}