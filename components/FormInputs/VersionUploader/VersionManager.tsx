'use client'

import { CollectionNames, ContentTypes, IFile } from "@/app/api/types"
import FormComponent from "@/components/Form/Form"
import { useEffect, useState } from "react"
import styles from './FileDropzone.module.css'
import SecondaryButton from "@/components/Buttons/SecondaryButton"
import { ArrowLeft, X } from "react-feather"
import Text from "../Text"
import VersionUploader from "."
import WarningButton from "@/components/Buttons/WarningButton"
import { useI18n } from "@/locales/client"
import { Popup } from "@/components/Popup/Popup"
import Select from "../Select"
import Checkbox from "../Checkbox"
import { convertToType } from "@/app/api/content"
import IconButton from "@/components/Buttons/IconButton"

export default function VersionManager({ onVersionsChanged, collectionName, presetVersions }: { onVersionsChanged: (versions: string) => void, collectionName: CollectionNames, presetVersions?: string }) {
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
                console.log(inputs)
                const contentVersion = inputs[0]
                const minecraftVersion = inputs[1]
                const url = inputs[3]
                const extraFiles = []
                for (let i = 4; i < inputs.length; i += 3) {
                    if(!inputs[i + 1] || inputs[i + 1].length > 0) continue
                    extraFiles.push({ type: inputs[i], url: inputs[i + 1], required: JSON.parse(inputs[i + 2]) })
                }
                let v: IFile = { ...renderVersion! };
                v.contentVersion = contentVersion
                v.minecraftVersion = minecraftVersion
                v.url = url
                v.extraFiles = extraFiles
                setRenderVersion(v)
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
                <Checkbox name={t('VersionManager.Version.Bedrock')} value={isBedrockType(renderVersion.type).toString()} description={t('VersionManager.Version.Bedrock_description')} />
                <Text type="text" name={t('VersionManager.Version.MainFile.link')} value={renderVersion?.worldUrl ?? renderVersion?.resourceUrl ?? renderVersion?.dataUrl ?? renderVersion?.url} />
                <div className={styles.files}>
                    {renderVersion?.extraFiles && renderVersion?.extraFiles.map((file, i) => {
                        return <div className={styles.file}>
                            <Select name={t('VersionManager.Version.ExtraFiles.file_type')} options={[{ value: ContentTypes.Maps, name: t('maps', {count: 1}) }, { value: ContentTypes.Datapacks, name: t('datapacks', {count: 1}) }, { value: ContentTypes.Resourcepacks, name: t('resourcepacks', {count: 1}) }]} value={file.type} />
                            <Text type="text" name={t('VersionManager.Version.ExtraFiles.link')} value={file.url} />
                            <Checkbox name={t('VersionManager.Version.ExtraFiles.required')} value={(file.required) ? file.required.toString() : "false"} description={t('VersionManager.Version.ExtraFiles.required_description')}/>
                            <IconButton className={styles.remove_button} onClick={() => {
                                let v: IFile = { ...renderVersion! };
                                v!.extraFiles?.splice(i, 1)
                                let vs = [...versions]
                                vs[idx] = v
                                setVersions(vs)
                                setRenderVersion(v)
                            }}><X /></IconButton>
                        </div>
                    })}
                </div>
                <SecondaryButton className={styles.add_file_button} onClick={() => {
                    Popup.createPopup({
                        content: <FormComponent id={`file${renderVersion?.extraFiles?.length}`} onSave={(inputs) => {
                            let v: IFile = { ...renderVersion! };
                            if (!v?.extraFiles) {
                                v!.extraFiles = []
                            }
                            v?.extraFiles.push({ type: "map", url: inputs[0], required: false })
                            let vs = [...versions]
                            vs[idx] = v
                            setVersions(vs)
                            setRenderVersion(v)
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

                                let type = convertToType(collectionName)

                                switch(inputs[0].substring(inputs[0].lastIndexOf('.') + 1)) {
                                    case 'mcpack':
                                        type = ContentTypes.BedrockResourcepacks
                                        break
                                    case 'mcworld':
                                        type = ContentTypes.BedrockMaps
                                        break
                                    case 'mctemplate':
                                        type = ContentTypes.BedrockMaps
                                        break
                                    case 'mcaddon':
                                        type = ContentTypes.Addons
                                        break
                                }

                                newVersions.push({ type: type, contentVersion: "1.0.0", minecraftVersion: "", url: inputs[0], extraFiles: [], createdDate: Date.now() })
                                newVersions.sort((a, b) => {
                                    return b.createdDate - a.createdDate
                                })
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

export function isBedrockType(type: string) {
    return type === "bedrock_map" || type === 'bedrock_resourcepack' || type === "addon" || type === "behavior_pack"
}