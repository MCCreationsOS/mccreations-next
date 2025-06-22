"use client";

import { getCreator } from "@/app/api/community";
import {
    convertToCollection,
    createEmptyCreation,
    createNewContent,
    requestApproval,
    updateContent,
} from "@/app/api/content";
import { useCreation, useTags } from "@/app/api/hooks/creations";
import { useToken, useTokenOrKey } from "@/app/api/hooks/users";
import {
    ContentTypes,
    IContentDoc,
    ICreator,
    IFile,
    IUser,
    Locales,
    TagKeys,
    Tags,
    Translation,
} from "@/app/api/types";
import ImageDropzone, {
    UploadedImageRepresentation,
} from "@/components/ImageDropzone";
import RichText from "@/components/RichText/RichText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VersionManager from "@/components/VersionManager/VersionManager";
import { useForm } from "@tanstack/react-form";
import { ChevronDown, ChevronRight, Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStorage } from "usehooks-ts";

export default function Page({params}: {params: {contentType: ContentTypes, slug: string}}) {
    const contentType = (params.contentType.endsWith("s") ? params.contentType.slice(0, -1) : params.contentType) as ContentTypes;
    const {creation} = useCreation(params.slug, contentType);
    const { token } = useTokenOrKey();
    const { tags } = useTags(contentType);
    const t = useTranslations();
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
        onSubmit: (data) => {
            saveCreation(
                data.value.title,
                data.value.shortDescription,
                data.value.slug,
                data.value.creators,
                data.value.description,
                data.value.tags,
                data.value.videoUrl
            );
        },
    });
    const [translations, setTranslations] = useState<string>("{}");
    const [newTranslationOpen, setNewTranslationOpen] = useState(false);

    const parsedTranslations = JSON.parse(translations) as Translation;

    useEffect(() => {
        if(!creation || "error" in creation) return;
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
    }, [creation]);

    if(!creation || "error" in creation) {
        return <div>Loading...</div>
    }

    const collectionName = convertToCollection(contentType);

    const saveCreation = (
        title: string,
        shortDescription: string,
        slug: string,
        creators: ICreator[],
        description: string,
        tags: string,
        videoUrl?: string,
        images?: string[],
        files?: IFile[]
    ) => {
        return new Promise<void>((resolve, reject) => {
            if (!creation || "error" in creation) return;
            if (slug.length < 2) {
                toast.error(t("Pages.Edit.Warnings.slug_too_short.description"));
                return;
            }

            let newCreation = {
                ...creation,
            };

            if (title) {
                newCreation.title = title;
            } else {
                toast.error(t("Pages.Edit.Warnings.title_too_short.description"));
            }

            if (shortDescription) {
                newCreation.shortDescription = shortDescription;
            } else {
                toast.error(t("Pages.Edit.Warnings.short_description_too_short.description"));
            }

            if (slug) {
                newCreation.slug = encodeURI(slug);
            } else {
                toast.error(t("Pages.Edit.Warnings.slug_too_short.description"));
            }

            if (creators) {
                newCreation.creators = creators;
            } else {
                toast.error(
                    t("Pages.Edit.Warnings.creator_too_short.description")
                );
            }

            if (videoUrl) {
                newCreation.videoUrl = videoUrl;
            }

            if (description) {
                newCreation.description = description + "";
            } else {
                toast.error(
                    t("Pages.Edit.Warnings.description_too_short.description")
                );
            }

            if (tags) {
                newCreation.tags = tags.split(",");
                newCreation.tags = newCreation.tags.filter(
                    (tag) => tag.length > 0
                );
                newCreation.tags = newCreation.tags?.filter((tag, index) => {
                    return newCreation.tags?.indexOf(tag) === index;
                });
            } else {
                toast.error(t("Pages.Edit.Warnings.tags_too_short.description"));
            }

            if (images) {
                newCreation.images = images;
            }

            if (files) {
                newCreation.files = files;
            }

            updateContent(newCreation, token, collectionName)
                .then((result) => {
                    if (result.error) {
                        toast.error(result.error.toString());
                        return;
                    }

                    toast.success(t("Pages.Edit.Messages.general_saved"));
                    resolve();
                })
                .catch((e) => {
                    toast.error(e.error);
                    reject();
                });
        });
    };

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
                    toast.success(t("Pages.Edit.Messages.translations_saved"));
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
                    <TabsTrigger value="general">{t('Pages.Edit.General.tab_title')}</TabsTrigger>
                    <TabsTrigger value="translations">{t('Pages.Edit.Translations.tab_title')}</TabsTrigger>
                </TabsList>
                <TabsContent value="general">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            generalForm.handleSubmit();
                        }}
                        className="flex flex-col gap-4"
                    >
                        <generalForm.Field
                                name="title"
                                children={(field) => (
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="title">{t("Pages.Edit.General.title")} <Required /></Label>
                                        <Input
                                            type="text"
                                            name="title"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => {
                                                field.handleChange(e.target.value);
                                            }}
                                            placeholder={t("Pages.Edit.General.title")}
                                        />
                                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                    </div>
                                )}
                                validators={{
                                    onSubmit: ({value}) => {
                                        if(value.length < 3) {
                                            return t("Pages.Edit.Warnings.title_too_short.description")
                                        }
                                    }
                                }}
                            />
                        <generalForm.Field
                            name="slug"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="slug">{t("Pages.Edit.General.slug")} <Required /></Label>
                                    <Input
                                        type="text"
                                        name="slug"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                        }}
                                            placeholder={t("Pages.Edit.General.slug")}
                                        />
                                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({value}) => {
                                    if(value.length < 5) {
                                        return t("Pages.Edit.Warnings.slug_too_short.description")
                                    } else if(value.length > 50) {
                                        return t("Pages.Edit.Warnings.slug_too_long.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                                name="shortDescription"
                                children={(field) => (
                                    <div className="flex flex-col gap-1">
                                        <Label htmlFor="shortDescription">{t("Pages.Edit.General.short_description")} <Required /></Label>
                                        <Input
                                            type="text"
                                            name="shortDescription"
                                            value={field.state.value}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => {
                                                field.handleChange(e.target.value);
                                            }}
                                            placeholder={t(
                                                "Pages.Edit.General.short_description"
                                            )}
                                        />
                                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                    </div>
                                )}
                                validators={{
                                    onSubmit: ({value}) => {
                                        if(value.length < 20) {
                                            return t("Pages.Edit.Warnings.short_description_too_short.description")
                                        } else if(value.length > 100) {
                                            return t("Pages.Edit.Warnings.short_description_too_long.description")
                                        }
                                    }
                                }}
                            />
                        <generalForm.Field name="creators" children={(field) => (
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="creators">{t("Pages.Edit.General.creators")} <Required /></Label>
                                <CreatorInput creators={field.state.value} onChange={field.handleChange} />
                                {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                            </div>
                        )} />
                        <generalForm.Field
                            name="videoUrl"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="videoUrl">{t("Pages.Edit.General.video_url")}</Label>
                                    <Input
                                        type="text"
                                        name="videoUrl"
                                        value={field.state.value}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                        }}
                                        placeholder={t("Pages.Edit.General.video_url")}
                                        />
                                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({value}) => {
                                    if(value) {
                                        if(!value.includes("https://www.youtube.com/watch?v=") && !value.includes("https://youtu.be/")) {
                                            return t("Pages.Edit.Warnings.invalid_video_url.description")
                                        }
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="description"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="description">{t("Pages.Edit.General.description")} <Required /></Label>
                                    <RichText
                                        sendOnChange={(v) => {
                                            field.handleChange(v);
                                        }}
                                            initialValue={field.state.value}
                                        />
                                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({value}) => {
                                    if(value.length < 50) {
                                        return t("Pages.Edit.Warnings.description_too_short.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="tags"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <Label htmlFor="tags">{t("Pages.Edit.General.tags")} <Required /></Label>
                                    <TagInput
                                        tags={tags}
                                        creation={creation}
                                            onChange={field.handleChange}
                                        />
                                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                                </div>
                            )}
                            validators={{
                                onSubmit: ({value}) => {
                                    if(value.length < 1) {
                                        return t("Pages.Edit.Warnings.tags_too_short.description")
                                    }
                                }
                            }}
                        />
                        <generalForm.Field
                            name="files"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <VersionManager
                                        collectionName={collectionName}
                                        presetVersions={JSON.stringify(creation.files)}
                                        onVersionsChanged={(files) => {
                                            field.handleChange(JSON.parse(files));
                                        }}
                                    />
                                </div>
                            )}
                        />
                        <generalForm.Field
                            name="images"
                            children={(field) => (
                                <div className="flex flex-col gap-1">
                                    <ImageDropzone
                                        onImagesUploaded={(images) => {
                                            field.handleChange(images.map((image) => image.url));
                                        }}
                                        presetFiles={JSON.stringify(
                                            creation?.images?.map((image) => {
                                                return { url: image, name: image };
                                            })
                                        )}
                                        allowMultiple={true}
                                    />
                                </div>
                            )}
                        />
                        <Button type="submit" className="w-fit">
                            <span>{t("Pages.Edit.General.save")}</span>
                        </Button>
                    </form>
                </TabsContent>
                <TabsContent value="translations">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        saveTranslations();
                    }} className="flex flex-col gap-4">
                        {Object.keys(parsedTranslations ?? {}).map((translation) => {
                            return <Collapsible key={translation} className="border-b border-white/15 pb-4 bg-card p-4">
                                <CollapsibleTrigger className="flex flex-row gap-2 items-center w-full">
                                    <h3 className="text-lg font-medium">{translation}</h3>
                                    <Button variant="ghost" size="icon">
                                        <ChevronDown />
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor={`translations.${translation}.title`}>{t("Pages.Edit.General.title")}</Label>
                                        <Input name={`translations.${translation}.title`} type="text" defaultValue={creation.translations?.[translation as keyof Translation]?.title ?? creation.title} 
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
                                        <Label htmlFor={`translations.${translation}.shortDescription`}>{t("Pages.Edit.General.short_description")}</Label>
                                        <Input name={`translations.${translation}.shortDescription`} type="text" defaultValue={creation.translations?.[translation as keyof Translation]?.shortDescription ?? creation.shortDescription} onChange={(e) => {
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
                                        <Label htmlFor={`translations.${translation}.description`}>{t("Pages.Edit.General.description")}</Label>
                                        <RichText initialValue={creation.translations?.[translation as keyof Translation]?.description ?? creation.description} sendOnChange={(v) => {
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
                                            <Label htmlFor={`translations.${translation}.approved`}>{t("Pages.Edit.Translations.approved")}</Label>
                                    </div>
                                </CollapsibleContent>
                                </Collapsible>
                        })}
                        <div className="flex flex-row gap-2">
                            <Button type="submit" className="w-fit">
                                <span>{t("Pages.Edit.Translations.save")}</span>
                            </Button>
                            <Dialog open={newTranslationOpen} onOpenChange={setNewTranslationOpen}>
                                <DialogTrigger asChild>
                                    <Button type="button" variant="secondary" className="w-fit">
                                        <span>{t("Pages.Edit.Translations.add_translation")}</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{t("Pages.Edit.Translations.add_translation")}</DialogTitle>
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
                                            <SelectValue placeholder={t("Pages.Edit.Translations.select_language")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Locales.map((locale) => (
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

function CreatorInput({creators, onChange}: {creators: ICreator[], onChange: (creators: ICreator[]) => void}) {
    const getFullCreator = (creator: ICreator) => {
        getCreator(creator.handle ?? creator.username).then((c) => {
            return c;
        })
    }
    return (
        <div className="flex flex-col gap-2">
            {creators?.map((creator, index) => (
                <div key={index} className="flex flex-row gap-2 items-center">
                    <CreatorAvatar creator={creator} />
                    <Input type="text" value={creator.username} onChange={(e) => {
                        onChange(creators.map((c, i) => i === index ? { ...c, username: e.target.value } : c))
                    }} placeholder="Username" />
                    <Input type="text" value={creator.handle} onChange={(e) => {
                        onChange(creators.map((c, i) => i === index ? { ...c, handle: e.target.value } : c))
                    }} placeholder="Handle" />
                    <Button variant="destructive" type="button" onClick={() => {
                        onChange(creators.filter((_, i) => i !== index))
                    }}><Trash /></Button>
                </div>
            ))}
            <Button variant="secondary" className="w-fit" type="button" onClick={() => {
                onChange([...creators, {
                    username: "",
                    handle: ""
                }])
            }}><Plus /> <span>Add Creator</span></Button>
        </div>
    )
}

function CreatorAvatar({creator}: {creator: ICreator}) {
    const [fullCreator, setFullCreator] = useState<IUser | undefined>(undefined);
    useEffect(() => {
        getCreator(creator.handle ?? creator.username).then((c) => {
            setFullCreator(c);
        })
    }, [creator])
    return (
        <Avatar className="w-7 h-7">
            <AvatarImage src={fullCreator?.iconURL} />
            <AvatarFallback>
                {creator.username.charAt(0)}
            </AvatarFallback>
        </Avatar>
    )
}

function TagInput({
    tags,
    creation,
    onChange,
}: {
    tags: Tags | { error: string };
    creation: IContentDoc;
    onChange: (tags: string) => void;
}) {
    const [tagInput, setTagInput] = useState(creation.tags?.join(",") ?? "");
    const [search, setSearch] = useState("");
    const [bestSuggestion, setBestSuggestion] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const t = useTranslations();

    const addTag = (tag: string) => {
        if (tagInput.split(",").includes(tag)) return;
        if (tag.length < 2) return;
        setTagInput(tagInput + "," + tag);
        setSearch("");
        onChange(tagInput);
    };

    const removeTag = (tag: string) => {
        setTagInput(tagInput.replace("," + tag, ""));
        onChange(tagInput);
    };

    return (
        <Popover onOpenChange={setShowSuggestions} open={showSuggestions}>
            <PopoverTrigger asChild>
                <div className="flex flex-row gap-2 px-2 py-1 border overflow-auto">
                    <Input
                        className="border-none min-w-[100px]"
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                addTag(bestSuggestion);
                            }
                        }}
                        placeholder="Start typing to search for tags..."
                    />
                    <Label className="text-md font-medium">
                        {tagInput.split(",").map((tag) => {
                            if (tag.length === 0) return null;
                            return (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    key={tag}
                                    className="text-sm border py-0 px-2"
                                    onClick={() => {
                                        removeTag(tag);
                                    }}
                                >
                                    {t(`Creation.Tags.${tag as TagKeys}`)}
                                </Button>
                            );
                        })}
                    </Label>
                </div>
            </PopoverTrigger>
            <PopoverContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                className="max-h-[25vh] overflow-y-auto"
            >
                <div className="flex flex-col gap-2">
                    <TagSearch
                        tags={tags}
                        search={search}
                        onSelect={addTag}
                        onBestSuggestionChanged={setBestSuggestion}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}

function TagSearch({
    tags,
    search,
    onBestSuggestionChanged,
    onSelect,
}: {
    tags: Tags | { error: string };
    search: string;
    onBestSuggestionChanged: (tag: string) => void;
    onSelect: (tag: string) => void;
}) {
    const t = useTranslations();
    const fTags: string[] = [];
    if (tags && "genre" in tags) {
        Object.keys(tags).forEach((category) => {
            tags[category].forEach((tag) => {
                fTags.push(tag);
            });
        });
    }
    return (
        <div className="flex flex-wrap gap-2 border-2 border-white/15 p-1">
            {fTags
                .filter((tag) =>
                    tag.toLowerCase().includes(search.toLowerCase())
                )
                .map((tag, index) => {
                    if (index === 0) {
                        onBestSuggestionChanged(tag);
                    }
                    return (
                        <Button
                            type="button"
                            variant="ghost"
                            key={tag}
                            className="text-sm border py-0 px-2"
                            onClick={() => {
                                onSelect(tag);
                            }}
                        >
                            {t(`Creation.Tags.${tag as TagKeys}`)}
                        </Button>
                    );
                })}
        </div>
    );
}

export function Required() {
    return (
        <span className="text-red-500">*</span>
    )
}