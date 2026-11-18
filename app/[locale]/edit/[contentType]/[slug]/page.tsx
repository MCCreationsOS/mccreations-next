"use client";

import { CreatorInput, Required, TagInput } from "@/app/[locale]/create/formElements";
import {
    CONTENT_RULES,
    convertToCollection,
    createEmptyCreation,
    errorCheckContent,
    requestApproval,
    updateContent,
} from "@/app/api/content";
import { useCreation, useTags } from "@/app/api/hooks/creations";
import { useTokenOrKey } from "@/app/api/hooks/users";
import {
    ContentTypes,
    IContentDoc,
    ICreator,
    IFile,
    Translation,
} from "@/app/api/types";
import ImageDropzone, {
} from "@/components/ImageDropzone";
import RichText from "@/components/RichText/RichText";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VersionManager from "@/components/VersionManager/VersionManager";
import { routing } from "@/i18n/routing";
import { useRouter } from "@/i18n/navigation";
import { useForm } from "@tanstack/react-form";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";
import Creation from "@/components/Creations/Page/Creation";
import { useSessionStorage } from "usehooks-ts";
import { VersionManager2 } from "@/components/VersionManager/VersionManager2";

export default function Page(props: { params: Promise<{ contentType: ContentTypes, slug: string }> }) {
    const params = use(props.params);
    const contentType = (params.contentType.endsWith("s") ? params.contentType.slice(0, -1) : params.contentType) as ContentTypes;
    const { creation, isLoading, refresh } = useCreation(params.slug, contentType, { editing: true });
    const [localCreation, setLocalCreation] = useSessionStorage<IContentDoc>(`localCreation:${params.slug}`, createEmptyCreation());
    const router = useRouter();
    const { token } = useTokenOrKey();
    const { tags } = useTags(contentType);
    const t = useTranslations();
    const [createVersionDialogOpen, setCreateVersionDialogOpen] = useState(false);
    const [editVersionDialogOpen, setEditVersionDialogOpen] = useState(false);
    const generalForm = useForm({
        defaultValues: {
            title: "",
            slug: "",
            shortDescription: "",
            creators: [] as ICreator[],
            videoUrl: "" as string | undefined,
            description: "",
            tags: "",
            files: [] as IFile[],
            images: [] as string[],
        },
        onSubmit: async (data) => {
            return await saveCreation(
                data.value.title,
                data.value.shortDescription,
                data.value.slug,
                data.value.creators,
                data.value.description,
                data.value.tags,
                data.value.videoUrl,
                data.value.images,
                data.value.files
            );
        },
    });
    const [translations, setTranslations] = useState<string>();
    const [newTranslationOpen, setNewTranslationOpen] = useState(false);

    const parsedTranslations = JSON.parse(translations ?? "{}");

    useEffect(() => {
        if (!creation || "error" in creation) return;
        generalForm.setFieldValue("title", creation.title);
        generalForm.setFieldValue("slug", creation.slug);
        generalForm.setFieldValue("shortDescription", creation.shortDescription);
        generalForm.setFieldValue("creators", creation.creators);
        generalForm.setFieldValue("description", creation.description);
        generalForm.setFieldValue("tags", creation.tags?.join(","));
        generalForm.setFieldValue("videoUrl", creation.videoUrl);
        generalForm.setFieldValue("images", creation.images);
        generalForm.setFieldValue("files", creation.files);
        setTranslations(JSON.stringify(creation.translations));

        setLocalCreation(creation);
    }, [creation]);

    if (isLoading) {
        return <div className="centered_content">{t("Pages.Edit.contentType.slug.loading")}</div>
    }

    if (!creation || "error" in creation) {
        return <div className="centered_content">{t("Pages.Edit.contentType.slug.not_found")}</div>
    }

    const collectionName = convertToCollection(contentType);

    const saveCreation = async (
        title: string,
        shortDescription: string,
        slug: string,
        creators: ICreator[],
        description: string,
        tags: string,
        videoUrl?: string,
        images?: string[],
        files?: IFile[]
    ): Promise<IContentDoc | undefined> => {
        if (!creation || "error" in creation) return;

        const newCreation: IContentDoc = {
            ...creation,
            title,
            shortDescription,
            slug,
            creators,
            description,
            videoUrl: videoUrl || undefined,
            // Drop empty entries and duplicates
            tags: tags.split(",").filter((tag, index, all) => tag.length > 0 && all.indexOf(tag) === index),
            images: images ?? creation.images,
            files: files ?? creation.files,
        };

        try {
            const result = await updateContent(newCreation, token, collectionName);
            if (result.error) {
                toast.error(result.error.toString());
                return;
            }
            toast.success(t("Pages.Edit.contentType.slug.Messages.general_saved"));
            refresh();
            const saved = { ...newCreation, slug: result.slug ?? newCreation.slug };
            if (saved.slug !== params.slug) {
                router.replace(`/edit/${params.contentType}/${saved.slug}`);
            }
            return saved;
        } catch (e: any) {
            toast.error(e?.error ?? String(e));
        }
    };

    const saveAndRequestApproval = async () => {
        await generalForm.validateAllFields("submit");
        if (!generalForm.state.isValid) return;
        const values = generalForm.state.values;
        const saved = await saveCreation(
            values.title,
            values.shortDescription,
            values.slug,
            values.creators,
            values.description,
            values.tags,
            values.videoUrl,
            values.images,
            values.files
        );
        if (!saved) return;
        const errors = errorCheckContent(saved);
        errors.forEach((error) => toast.error(t(error.error)));
        if (errors.length > 0) return;
        try {
            await requestApproval(saved.slug, collectionName, token);
            refresh();
            toast.success(t("Pages.Edit.contentType.slug.Messages.approval_requested"));
        } catch (e: any) {
            toast.error(e?.error ?? String(e));
        }
    };

    const upsertPendingFile = (prevFiles: IFile[], file: IFile) => {
        const idx = prevFiles.findIndex((f) => f.createdDate === file.createdDate);
        if (idx >= 0) {
            return prevFiles.map((f, i) => (i === idx ? file : f));
        }
        return [file, ...prevFiles];
    };

    const filesChanged =
        JSON.stringify(localCreation.files.map((f) => ({ url: f.url, contentVersion: f.contentVersion, minecraftVersion: f.minecraftVersion, createdDate: f.createdDate, changelog: f.changelog }))) !==
        JSON.stringify(creation.files.map((f) => ({ url: f.url, contentVersion: f.contentVersion, minecraftVersion: f.minecraftVersion, createdDate: f.createdDate, changelog: f.changelog })));

    const saveTranslations = () => {
        const newCreation = {
            ...creation,
            translations: parsedTranslations
        };

        return new Promise<void>((resolve, reject) => {
            updateContent(newCreation, token, collectionName)
                .then((result) => {
                    if (result.error) {
                        toast.error(result.error.toString());
                        return;
                    }
                    toast.success(t("Pages.Edit.contentType.slug.Messages.translations_saved"));
                    resolve();
                })
                .catch((e) => {
                    toast.error(e.error);
                    reject();
                });
        });
    };

    return (
        <div className="max-w-4xl mx-auto my-10">
            <Tabs defaultValue="general">
                <TabsList className="w-full mb-4">
                    <TabsTrigger value="general" className="cursor-pointer">{t('Pages.Edit.contentType.slug.General.tab_title')}</TabsTrigger>
                    <TabsTrigger value="preview" className="cursor-pointer">{t('Pages.Edit.contentType.slug.Preview.tab_title')}</TabsTrigger>
                    <TabsTrigger value="translations" className="cursor-pointer">{t('Pages.Edit.contentType.slug.Translations.tab_title')}</TabsTrigger>
                </TabsList>
                <TabsContent value="preview">
                    <Creation creation={localCreation} collectionName={collectionName} />
                </TabsContent>
                <TabsContent value="general">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            generalForm.handleSubmit();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <generalForm.Field
                            name="files"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label>{t("Pages.Edit.contentType.slug.General.versions")}</Label>
                                    <div className="flex flex-wrap gap-1">
                                        {localCreation.files.map((file, idx) => {
                                            if(creation.files.find((f) => f.createdDate === file.createdDate)) {
                                                return (
                                                    <Dialog key={file.url}>
                                                    <DialogTrigger asChild><Button variant="secondary" type="button"><span>{file.contentVersion}</span></Button></DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>{file.contentVersion}</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="flex flex-col gap-1 min-w-lg">
                                                            <div className="flex flex-row gap-1">
                                                                <span className="flex-1">{t("Components.VersionManager.Version.minecraft_version")}</span>
                                                                <span>{typeof file.minecraftVersion === "string" ? file.minecraftVersion : file.minecraftVersion.join(", ")}</span>
                                                            </div>
                                                            <div className="flex flex-row gap-1">
                                                                <span className="flex-1">{t("Pages.Edit.contentType.slug.General.url")}</span>
                                                                <span>{file.url}</span>
                                                            </div>
                                                            <div className="flex flex-row gap-1">
                                                                <span className="flex-1">{t("Pages.Edit.contentType.slug.General.created_date")}</span>
                                                                <span>{new Date(file.createdDate).toLocaleDateString()}</span>
                                                            </div>
                                                            {file.changelog && (
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="flex-1">{t("Pages.Edit.contentType.slug.General.changelog")}</span>
                                                                    <span dangerouslySetInnerHTML={{ __html: file.changelog }} />
                                                                </div>
                                                            )}
                                                            <Button variant="destructive" type="button" onClick={() => {
                                                                field.handleChange(localCreation.files.filter((f, index) => index !== idx));
                                                                setLocalCreation({
                                                                    ...localCreation,
                                                                    files: localCreation.files.filter((f, index) => index !== idx)
                                                                });
                                                            }}><span>{t("Components.VersionManager.Version.delete")}</span></Button>
                                                        </div>
                                                    </DialogContent>
                                                    </Dialog>
                                                )
                                            } else {
                                                return (
                                                    <Dialog key={file.url} open={editVersionDialogOpen} onOpenChange={setEditVersionDialogOpen}>
                                                        <DialogTrigger asChild><Button variant="default" type="button"><span>{file.contentVersion}</span></Button></DialogTrigger>
                                                        <DialogContent className="overflow-x-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>{file.contentVersion}</DialogTitle>
                                                            </DialogHeader>
                                                            <VersionManager2 enableChangelog={true} initialFile={file} forWhat={creation.slug} onChange={(nextFile) => {
                                                                setLocalCreation((prev) => {
                                                                    const files = upsertPendingFile(prev.files, nextFile);
                                                                    field.handleChange(files);
                                                                    return { ...prev, files };
                                                                });
                                                            }} />
                                                            <Button type="button" onClick={() => {setEditVersionDialogOpen(false); generalForm.handleSubmit();}} disabled={generalForm.state.isSubmitting}><span>{t("Pages.Edit.contentType.slug.General.save")}</span></Button>
                                                        </DialogContent>
                                                    </Dialog>
                                                )
                                            }
                                        })}
                                        <Dialog open={createVersionDialogOpen} onOpenChange={setCreateVersionDialogOpen} >
                                            <DialogTrigger asChild><Button hidden={localCreation.files.some((f) => !creation.files.find((cf) => cf.createdDate === f.createdDate))} variant="default" type="button"><span>{t("Pages.Edit.contentType.slug.General.update", { content_type: t(`${contentType}`, { count: 1 }) })}</span></Button></DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{t("Pages.Edit.contentType.slug.General.update", { content_type: t(`${contentType}`, { count: 1 }) })}</DialogTitle>
                                                </DialogHeader>
                                                <VersionManager2 enableChangelog={true} forWhat={creation.slug} onChange={(nextFile) => {
                                                    setLocalCreation((prev) => {
                                                        const files = upsertPendingFile(prev.files, nextFile);
                                                        field.handleChange(files);
                                                        return { ...prev, files };
                                                    });
                                                }} />
                                                <Button type="button" onClick={() => {setCreateVersionDialogOpen(false); generalForm.handleSubmit();}} disabled={generalForm.state.isSubmitting || !localCreation.files.some((f) => !creation.files.find((cf) => cf.createdDate === f.createdDate))}><span>{t("Pages.Edit.contentType.slug.General.save")}</span></Button>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    {filesChanged && <p className="text-sm text-red-500">{t("Pages.Edit.contentType.slug.General.unsaved_versions")}</p>}
                                </div>
                            )}
                        />
                        <generalForm.Field
                            name="title"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="title">{t("Pages.Edit.contentType.slug.General.title")} <Required /></Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setLocalCreation({
                                                ...localCreation,
                                                title: e.target.value
                                            });
                                        }}
                                        placeholder={t("Pages.Edit.contentType.slug.General.title")}
                                    />
                                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value.length < CONTENT_RULES.titleMin) {
                                        return t("Pages.Edit.contentType.slug.Warnings.title_too_short.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="slug"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="slug">{t("Pages.Edit.contentType.slug.General.slug")} <Required /></Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        name="slug"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setLocalCreation({
                                                ...localCreation,
                                                slug: e.target.value
                                            });
                                        }}
                                        placeholder={t("Pages.Edit.contentType.slug.General.slug")}
                                    />
                                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value.length < CONTENT_RULES.slugMin) {
                                        return t("Pages.Edit.contentType.slug.Warnings.slug_too_short.description")
                                    } else if (value.length > CONTENT_RULES.slugMax) {
                                        return t("Pages.Edit.contentType.slug.Warnings.slug_too_long.description")
                                    } else if (!CONTENT_RULES.slugPattern.test(value)) {
                                        return t("Pages.Create.Details.slug_invalid_characters")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="shortDescription"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="shortDescription">{t("Pages.Edit.contentType.slug.General.short_description")} <Required /></Label>
                                    <Input
                                        id="shortDescription"
                                        type="text"
                                        name="shortDescription"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setLocalCreation({
                                                ...localCreation,
                                                shortDescription: e.target.value
                                            });
                                        }}
                                        placeholder={t(
                                            "Pages.Edit.contentType.slug.General.short_description"
                                        )}
                                    />
                                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value.length < CONTENT_RULES.shortDescriptionMin) {
                                        return t("Pages.Edit.contentType.slug.Warnings.short_description_too_short.description")
                                    } else if (value.length > CONTENT_RULES.shortDescriptionMax) {
                                        return t("Pages.Edit.contentType.slug.Warnings.short_description_too_long.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field name="creators" children={(field) => (
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="creators">{t("Pages.Edit.contentType.slug.General.creators")} <Required /></Label>
                                <CreatorInput id="creators" creators={field.state.value} onChange={field.handleChange} />
                                {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                            </div>
                        )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value.length < 1) {
                                        return t("Pages.Edit.contentType.slug.Warnings.creator_too_short.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="videoUrl"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="videoUrl">{t("Pages.Edit.contentType.slug.General.video_url")}</Label>
                                    <Input
                                        id="videoUrl"
                                        type="text"
                                        name="videoUrl"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            setLocalCreation({
                                                ...localCreation,
                                                videoUrl: e.target.value
                                            });
                                        }}
                                        placeholder={t("Pages.Edit.contentType.slug.General.video_url")}
                                    />
                                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value) {
                                        if (!value.startsWith("https://www.youtube.com/watch?v=") && !value.startsWith("https://youtu.be/")) {
                                            return t("Pages.Edit.contentType.slug.Warnings.invalid_video_url.description")
                                        }
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="description"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">{t("Pages.Edit.contentType.slug.General.description")} <Required /></Label>
                                    <RichText
                                        id="description"
                                        sendOnChange={(v) => {
                                            field.handleChange(v);
                                            setLocalCreation({
                                                ...localCreation,
                                                description: v
                                            });
                                        }}
                                        initialValue={creation.description}
                                    />
                                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value.length < CONTENT_RULES.descriptionMin) {
                                        return t("Pages.Edit.contentType.slug.Warnings.description_too_short.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="tags"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="tags">{t("Pages.Edit.contentType.slug.General.tags")} <Required /></Label>
                                    <TagInput
                                        id="tags"
                                        tags={tags}
                                        creation={creation}
                                        onChange={(tags) => {
                                            field.handleChange(tags);
                                            setLocalCreation({
                                                ...localCreation,
                                                tags: tags.split(",").filter((tag) => tag.length > 0)
                                            });
                                        }}
                                    />
                                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({ value }) => {
                                    if (value.length < 1) {
                                        return t("Pages.Edit.contentType.slug.Warnings.tags_too_short.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="images"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label className="mb-2">{t('Pages.Edit.contentType.slug.General.images')}</Label>
                                    <ImageDropzone
                                        forWhat={creation.slug}
                                        onImagesUploaded={(images) => {
                                            field.handleChange(images.filter(image => image.url).map((image) => image.url!));
                                            setLocalCreation({
                                                ...localCreation,
                                                images: images.filter(image => image.url).map((image) => image.url!)
                                            });
                                        }}
                                        presetFiles={JSON.stringify(
                                            creation?.images?.map((image) => {
                                                return { url: image, name: image, uploaded: true, progress: 100 };
                                            })
                                        )}
                                        allowMultiple={true}
                                    />
                                </div>
                            )}
                        />
                        <div className="flex gap-1">
                            <generalForm.Subscribe selector={(state) => state.isSubmitting} children={(isSubmitting) => (
                                <Button type="submit" className="w-fit" disabled={isSubmitting}>
                                    <span>{t("Pages.Edit.contentType.slug.General.save")}</span>
                                </Button>
                            )}/>
                            {creation.status === 0 && <Button type="button" className="w-fit" onClick={saveAndRequestApproval}>
                                <span>{t("Pages.Edit.contentType.slug.General.request_approval")}</span>
                            </Button>}
                        </div>
                    </form>
                </TabsContent>
                <TabsContent value="translations">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        saveTranslations();
                    }} className="flex flex-col gap-4">
                        {Object.keys(parsedTranslations ?? {}).map((translation) => {
                            return <Collapsible key={translation} className="border-b border-white/15 pb-4 bg-card p-4">
                                <CollapsibleTrigger className="flex flex-row gap-2 items-center w-full cursor-pointer">
                                    <h3 className="text-lg font-medium">{translation}</h3>
                                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor={`translations.${translation}.title`}>{t("Pages.Edit.contentType.slug.General.title")}</Label>
                                        <Input id={`translations.${translation}.title`} name={`translations.${translation}.title`} type="text" defaultValue={creation.translations?.[translation as keyof Translation]?.title ?? creation.title}
                                            onChange={(e) => {
                                                setTranslations(JSON.stringify({
                                                    ...parsedTranslations,
                                                    [translation]: {
                                                        ...parsedTranslations[translation as keyof Translation],
                                                        title: e.target.value
                                                    }
                                                }));
                                            }} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor={`translations.${translation}.shortDescription`}>{t("Pages.Edit.contentType.slug.General.short_description")}</Label>
                                        <Input id={`translations.${translation}.shortDescription`} name={`translations.${translation}.shortDescription`} type="text" defaultValue={creation.translations?.[translation as keyof Translation]?.shortDescription ?? creation.shortDescription} onChange={(e) => {
                                            setTranslations(JSON.stringify({
                                                ...parsedTranslations,
                                                [translation]: {
                                                    ...parsedTranslations[translation as keyof Translation],
                                                    shortDescription: e.target.value
                                                }
                                            }));
                                        }} />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor={`translations.${translation}.description`}>{t("Pages.Edit.contentType.slug.General.description")}</Label>
                                        <RichText id={`translations.${translation}.description`} initialValue={creation.translations?.[translation as keyof Translation]?.description ?? creation.description} sendOnChange={(v) => {
                                            setTranslations(JSON.stringify({
                                                ...parsedTranslations,
                                                [translation]: {
                                                    ...parsedTranslations[translation as keyof Translation],
                                                    description: v
                                                }
                                            }));
                                        }} />
                                    </div>
                                    <div className="flex flex-row gap-2 items-center">
                                        <Checkbox
                                            id={`translations.${translation}.approved`}
                                            name={`translations.${translation}.approved`}
                                            defaultChecked={creation.translations?.[translation as keyof Translation]?.approved}
                                            onCheckedChange={(checked) => {
                                                setTranslations(JSON.stringify({
                                                    ...parsedTranslations,
                                                    [translation]: {
                                                        ...parsedTranslations[translation as keyof Translation],
                                                        approved: checked as boolean
                                                    }
                                                }));
                                            }} />
                                        <Label htmlFor={`translations.${translation}.approved`}>{t("Pages.Edit.contentType.slug.Translations.approved")}</Label>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        })}
                        <div className="flex flex-row gap-2">
                            <Button type="submit" className="w-fit">
                                <span>{t("Pages.Edit.contentType.slug.Translations.save")}</span>
                            </Button>
                            <Dialog open={newTranslationOpen} onOpenChange={setNewTranslationOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="secondary" className="w-fit">
                                        <span>{t("Pages.Edit.contentType.slug.Translations.add_translation")}</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("Pages.Edit.contentType.slug.Translations.add_translation")}</DialogTitle>
                                    </DialogHeader>
                                    <Select onValueChange={(value) => {
                                        setTranslations(JSON.stringify({
                                            ...parsedTranslations,
                                            [value]: {
                                                description: "",
                                                shortDescription: "",
                                                title: "",
                                                approved: true,
                                                date: Date.now()
                                            }
                                        }));
                                    }}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t("Pages.Edit.contentType.slug.Translations.select_language")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {routing.locales.map((locale) => (
                                                <SelectItem key={locale} value={locale}>{locale}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button type="button" className="w-fit" onClick={() => {
                                        setNewTranslationOpen(false);
                                    }}>
                                        <span>{t("Pages.Create.save")}</span>
                                    </Button>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
}