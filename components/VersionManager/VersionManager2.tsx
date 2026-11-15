import { IContentDoc, IFile } from "@/app/api/types";
import { useForm } from "@tanstack/react-form";
import { useTranslations } from "next-intl";
import { useState } from "react";
import FileDropzone from "./FileUpload";
import { CheckSquare2, Trash } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import MinecraftVersionInput from "./MinecraftVersionInput";

export function VersionManager2({ initialFile, forWhat, onChange }: { initialFile?: IFile, forWhat: string, onChange: (file: IFile) => void }) {
    const t = useTranslations();
    const [url, setUrl] = useState<string | undefined>(initialFile?.url);
    const [file, setFile] = useState<IFile | undefined>(initialFile);

    const editForm = useForm({
        defaultValues: {
            contentVersion: file?.contentVersion ?? "1.0.0",
            minecraftVersion: file?.minecraftVersion ?? [] as string[],
            bedrock: false,
            url: url
        }
    })

    const handleChange = (contentVersion?: string, minecraftVersion?: string[], url?: string) => {
        const newFile = {
            ...file,
            contentVersion: contentVersion ?? file?.contentVersion ?? "1.0.0",
            minecraftVersion: minecraftVersion ?? file?.minecraftVersion ?? [] as string[],
            url: url ?? file?.url ?? "",
            createdDate: file?.createdDate ?? Date.now()
        }
        setFile(newFile as IFile);
        onChange(newFile as IFile);
    }

    return (
        <>
            {!url && <FileDropzone forWhat={forWhat} onFilesUploaded={(url) => { setUrl(url); handleChange(undefined, undefined, url);}} />}
            {url && (
                <div>
                    <div className="flex flex-row gap-2 bg-card p-4 mb-4">
                        <div className="text-green-500">
                            <CheckSquare2/>
                        </div>
                        <div className="flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-green-500">Uploaded!</h3>
                        </div>
                        <div className="cursor-pointer" onClick={() => setUrl(undefined)}>
                            <Trash/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 max-w-2xl" onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
                            // Changes are already applied; just keep Enter from submitting the parent form
                            e.preventDefault()
                        }
                    }}>
                        <editForm.Field name="contentVersion" children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>{t('Components.VersionManager.Version.version_number')}</Label>
                                <Input id={field.name} name={field.name} value={field.state.value} onChange={(e) => { field.handleChange(e.target.value); handleChange(e.target.value)}} />
                                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                        )} />
                        <editForm.Field name="minecraftVersion" children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>{t('Components.VersionManager.Version.minecraft_version')}</Label>
                                <MinecraftVersionInput version={typeof field.state.value === "string" ? field.state.value : field.state.value?.join(",") ?? ""} onChange={(v) => { field.handleChange(v.split(",").filter((version) => version.length > 0)); handleChange(undefined, v.split(",").filter((version) => version.length > 0));}} />
                                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                        )} />
                        {/* <editForm.Field name="bedrock" children={(field) => (
                                // <Checkbox {...field.props} />
                            )}/> */}
                        <editForm.Field name="url" children={(field) => (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor={field.name}>{t('Components.VersionManager.Version.MainFile.link')}</Label>
                                <Input id={field.name} name={field.name} type="url" value={field.state.value} onChange={(e) => { field.handleChange(e.target.value); handleChange(undefined, undefined, e.target.value);}} />
                                {!field.state.meta.isValid && <p className="text-red-500">{field.state.meta.errors.join(", ")}</p>}
                            </div>
                        )} />
                    </div>
                </div>
                
            )}
        </>
    );
}