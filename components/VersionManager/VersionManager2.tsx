import { IFile } from "@/app/api/types";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FileDropzone from "./FileUpload";
import { CheckSquare2, Trash } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MinecraftVersionInput from "./MinecraftVersionInput";
import RichText from "../RichText/RichText";
import { Button } from "../ui/button";

export function VersionManager2({ initialFile, enableChangelog, forWhat, onChange }: { initialFile?: IFile, enableChangelog?: boolean, forWhat: string, onChange: (file: IFile) => void }) {
    const t = useTranslations();
    const [url, setUrl] = useState<string | undefined>(initialFile?.url);
    const [file, setFile] = useState<IFile | undefined>(initialFile);

    const editForm = useForm({
        defaultValues: {
            contentVersion: file?.contentVersion ?? "1.0.0",
            minecraftVersion: (Array.isArray(file?.minecraftVersion) ? file?.minecraftVersion : file?.minecraftVersion ? [file.minecraftVersion] : []) as string[],
            bedrock: false,
            url: url ?? "",
            changelog: enableChangelog ? file?.changelog ?? "" : ""
        }
    })

    const handleChange = (contentVersion?: string, minecraftVersion?: string[], nextUrl?: string, changelog?: string) => {
        const resolvedUrl = nextUrl ?? file?.url ?? url ?? ""
        const newFile = {
            ...file,
            contentVersion: contentVersion ?? file?.contentVersion ?? "1.0.0",
            minecraftVersion: minecraftVersion ?? file?.minecraftVersion ?? [] as string[],
            url: resolvedUrl,
            createdDate: file?.createdDate ?? Date.now(),
            changelog: changelog ?? file?.changelog ?? ""
        }
        setFile(newFile as IFile);
        onChange(newFile as IFile);
    }

    const clearUpload = () => {
        setUrl(undefined);
        editForm.setFieldValue("url", "");
        const cleared = {
            ...file,
            contentVersion: file?.contentVersion ?? "1.0.0",
            minecraftVersion: file?.minecraftVersion ?? [] as string[],
            url: "",
            createdDate: file?.createdDate ?? Date.now(),
            changelog: file?.changelog ?? ""
        } as IFile;
        setFile(cleared);
        onChange(cleared);
    }

    return (
        <>
            {!url && <FileDropzone forWhat={forWhat} onFilesUploaded={(uploadedUrl) => {
                setUrl(uploadedUrl);
                editForm.setFieldValue("url", uploadedUrl);
                handleChange(undefined, undefined, uploadedUrl);
            }} />}
            {url && (
                <div>
                    <div className="flex flex-row gap-2 bg-card p-4 mb-4">
                        <div className="text-green-500">
                            <CheckSquare2/>
                        </div>
                        <div className="flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-green-500">{t('Components.Dropzone.uploaded', { file: '' }).trim()}</h3>
                        </div>
                        <Button type="button" variant="ghost" size="icon" onClick={clearUpload} aria-label={t('Components.VersionManager.Version.cancel')}>
                            <Trash/>
                        </Button>
                    </div>
                    <div className="flex flex-col gap-4 max-w-2xl" onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
                            e.preventDefault()
                        }
                    }}>
                        <editForm.Field name="contentVersion" children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="vm2-contentVersion">{t('Components.VersionManager.Version.version_number')}</Label>
                                <Input id="vm2-contentVersion" name={field.name} value={field.state.value} onChange={(e) => { field.handleChange(e.target.value); handleChange(e.target.value)}} />
                                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                        )} />
                        <editForm.Field name="minecraftVersion" children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="vm2-minecraftVersion">{t('Components.VersionManager.Version.minecraft_version')}</Label>
                                <MinecraftVersionInput version={typeof field.state.value === "string" ? field.state.value : field.state.value?.join(",") ?? ""} onChange={(v) => { field.handleChange(v.split(",").filter((version) => version.length > 0)); handleChange(undefined, v.split(",").filter((version) => version.length > 0));}} />
                                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                        )} />
                        <editForm.Field name="url" children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="vm2-url">{t('Components.VersionManager.Version.MainFile.link')}</Label>
                                <Input id="vm2-url" name={field.name} type="url" value={field.state.value} onChange={(e) => { field.handleChange(e.target.value); handleChange(undefined, undefined, e.target.value);}} />
                                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                        )} />
                        {enableChangelog && (
                            <editForm.Field name="changelog" children={(field) => (
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="vm2-changelog">{t('Components.VersionManager.Version.changelog')}</Label>
                                    <RichText initialValue={field.state.value} sendOnChange={(content) => { field.handleChange(content); handleChange(undefined, undefined, undefined, content);}} />
                                </div>
                            )} />
                        )}
                    </div>
                </div>
                
            )}
        </>
    );
}
