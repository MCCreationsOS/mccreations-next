import { getCreator } from "@/app/api/community";
import { convertToCollection, createEmptyCreation, createNewContent, updateContent } from "@/app/api/content";
import { useTags } from "@/app/api/hooks/creations";
import { useToken, useTokenOrKey } from "@/app/api/hooks/users";
import { ContentTypes, IContentDoc, ICreator, IUser, TagKeys, Tags } from "@/app/api/types";
import ImageDropzone, { UploadedImageRepresentation } from "@/components/ImageDropzone";
import RichText from "@/components/RichText/RichText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import VersionManager from "@/components/VersionManager/VersionManager";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { ChevronRight, Plus, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStorage } from "usehooks-ts";

export function Files({ handleNext }: { handleNext: () => void }) {
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const contentType = creation.type;
    const collectionName = convertToCollection(contentType);
    const { token } = useTokenOrKey();
    const t = useTranslations();

    const saveVersionsForm = (versions: string) => {
        if (!creation || "error" in creation) return;

        let newCreation = {
            ...creation,
        };
        newCreation.files = JSON.parse(versions);

        newCreation.files?.sort((a, b) => {
            return b.createdDate - a.createdDate;
        });

        updateContent(newCreation, token, collectionName)
            .then(() => {
                setCreation(newCreation);
                toast.success(t("Pages.Create.Files.saved"));
            })
            .catch((e) => {
                toast.error(e.error);
            });
    };

    return (
        <>
            <VersionManager
                collectionName={collectionName}
                presetVersions={JSON.stringify(creation.files)}
                onVersionsChanged={saveVersionsForm}
            />
            <Button onClick={handleNext} className="w-fit mt-2">
                <span>{t("Pages.Create.next")}</span>
                <ChevronRight />
            </Button>
        </>
    );
}

export function Images({ handleNext }: { handleNext: () => void }) {
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const contentType = creation.type;
    const collectionName = convertToCollection(contentType);
    const { token } = useTokenOrKey();
    const t = useTranslations();
    const router = useRouter();
    const form = useForm({
        defaultValues: {
            images: creation.images,
        },
    });

    const saveImagesForm = (files: UploadedImageRepresentation[]) => {
        if (!creation || "error" in creation) return;

        let newCreation = {
            ...creation,
        };
        newCreation.images = files.map((f) => f.url);
        updateContent(newCreation, token, collectionName)
            .then(() => {
                setCreation(newCreation);
                toast.success(t("Pages.Create.Images.saved"));
            })
            .catch((e) => {
                toast.error(e.error);
            });
    };

    return (
        <div className="flex flex-col gap-4 ">
            <ImageDropzone
                onImagesUploaded={saveImagesForm}
                presetFiles={JSON.stringify(
                    creation?.images?.map((image) => {
                        return { url: image, name: image };
                    })
                )}
                allowMultiple={true}
            />
            <Button onClick={handleNext} className="w-fit">
                <span>{t("Pages.Create.finish")}</span>
                <ChevronRight />
            </Button>
        </div>
    );
}


export function Required() {
    return (
        <span className="text-red-500">*</span>
    )
}

export function CreateBasicInfo({ handleNext }: { handleNext: () => void }) {
    const { token } = useToken();
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const t = useTranslations();
    const form = useForm({
        defaultValues: {
            title: creation.title ?? "",
            type: creation.type ?? ContentTypes.Maps,
            shortDescription: creation.shortDescription ?? "",
        },
        onSubmit: (data) => {
            onMapCreate(
                data.value.title,
                data.value.type as ContentTypes,
                data.value.shortDescription
            );
        },
        validators: {
            onChangeAsync: (data) => {
                setCreation({
                    ...creation,
                    title: data.value.title ?? "",
                    type: (data.value.type ?? "map") as ContentTypes,
                    shortDescription: data.value.shortDescription
                })
            }
        }
    });

    const onMapCreate = (
        title?: string,
        type?: ContentTypes,
        shortDescription?: string
    ) => {
        if (!title) toast.error(t("Pages.Create.BasicInfo.missing_title"));
        if (!type) toast.error(t("Pages.Create.BasicInfo.missing_type"));
        if (!shortDescription)
            toast.error(t("Pages.Create.BasicInfo.missing_short_description"));

        setCreation({
            ...creation,
            title: title!,
            type: type!,
            shortDescription: shortDescription!,
            slug:
                creation.slug ??
                encodeURIComponent(title!.toLowerCase().replace(/ /g, "-")),
        });

        createNewContent(title!, type!, shortDescription!, token).then(
            (key) => {
                if ("error" in key) {
                    toast(key.error);
                    return;
                }
                if (key && "key" in key) {
                    sessionStorage.setItem("temp_key", key.key);
                }
                setCreation({ ...creation, ...key.creation });
                handleNext();
            }
        );
    };

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="flex flex-col gap-4"
            >
                <form.Field
                    name="title"
                    children={(field) => (
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="title">{t("Pages.Create.BasicInfo.title")} <Required /></Label>
                            <Input
                                type="text"
                                name="title"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                    field.handleChange(e.target.value);
                                }}
                                placeholder={t("Pages.Create.BasicInfo.title")}
                            />
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </div>
                    )}
                    validators={{
                        onSubmit: ({ value }) => {
                            if (value.length < 3) {
                                return t("Pages.Create.BasicInfo.title_too_short")
                            }
                        }
                    }}
                />
                <form.Field
                    name="type"
                    children={(field) => (
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="type">{t("Pages.Create.BasicInfo.type")} <Required /></Label>
                            <Select
                                name="type"
                                defaultValue="map"
                                value={field.state.value}
                                onValueChange={(value) => {
                                    //@ts-ignore
                                    field.handleChange(value);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value="map"
                                        className="hover:bg-white/40 cursor-pointer"
                                    >
                                        {t("map", { count: 1 })}
                                    </SelectItem>
                                    <SelectItem
                                        value="datapack"
                                        className="hover:bg-white/40 cursor-pointer"
                                    >
                                        {t("datapack", { count: 1 })}
                                    </SelectItem>
                                    <SelectItem
                                        value="resourcepack"
                                        className="hover:bg-white/40 cursor-pointer"
                                    >
                                        {t("resourcepack", { count: 1 })}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </div>
                    )}
                />
                <form.Field
                    name="shortDescription"
                    children={(field) => (
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="shortDescription">{t("Pages.Create.BasicInfo.short_description")} <Required /></Label>
                            <Input
                                type="text"
                                name="shortDescription"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => {
                                    field.handleChange(e.target.value);
                                }}
                                placeholder={t(
                                    "Pages.Create.BasicInfo.short_description"
                                )}
                            />
                            {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                        </div>
                    )}
                    validators={{
                        onSubmit: ({ value }) => {
                            if (value.length < 20) {
                                return t("Pages.Create.BasicInfo.short_description_too_short")
                            } else if (value.length > 150) {
                                return t("Pages.Create.BasicInfo.short_description_too_long")
                            }
                        }
                    }}
                />
                <Button type="submit" className="w-fit">
                    <span>{t("Pages.Create.next")}</span>
                    <ChevronRight />
                </Button>
            </form>
        </>
    );
}

export function CreateDetails({ handleNext }: { handleNext: () => void }) {
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const contentType = creation.type;
    const collectionName = convertToCollection(contentType);
    const { token } = useTokenOrKey();
    const { tags } = useTags(contentType);
    const t = useTranslations();
    const form = useForm({
        defaultValues: {
            slug: creation.slug,
            creators: creation.creators,
            videoUrl: creation.videoUrl,
            description: creation.description,
            tags: creation.tags?.join(","),
        },
        onSubmit: (data) => {
            saveGeneralForm(
                data.value.slug,
                data.value.creators,
                data.value.description,
                data.value.tags,
                data.value.videoUrl
            );
        },
        validators: {
            onChangeAsync: (data) => {
                sessionStorage.setItem("tempCreation", JSON.stringify({
                    ...creation,
                    slug: data.value.slug,
                    creators: data.value.creators,
                    videoUrl: data.value.videoUrl,
                    description: data.value.description,
                    tags: data.value.tags.split(",")
                }));
            }
        }
    });

    let showLeaderboardsHelp =
        creation.extraFeatures?.leaderboards.use !== false;

    const saveGeneralForm = (
        slug: string,
        creators: ICreator[],
        description: string,
        tags: string,
        videoUrl?: string
    ) => {
        return new Promise<void>((resolve, reject) => {
            if (!creation || "error" in creation) return;
            if (slug.length < 2) {
                toast.error(t("Pages.Create.Details.missing_slug"));
                return;
            }

            let newCreation = {
                ...creation,
            };

            if (slug) {
                newCreation.slug = encodeURI(slug);
            } else {
                toast.error(t("Pages.Create.Details.missing_slug"));
            }

            if (creators) {
                newCreation.creators = creators;
            } else {
                toast.error(
                    t("Pages.Create.Details.missing_creators")
                );
            }

            if (videoUrl) {
                newCreation.videoUrl = videoUrl;
            }

            if (description) {
                newCreation.description = description + "";
            } else {
                toast.error(
                    t("Pages.Create.Details.missing_description")
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
                toast.error(t("Pages.Create.Details.missing_tags"));
            }

            updateContent(newCreation, token, collectionName)
                .then((result) => {
                    if (result.error) {
                        toast.error(result.error.toString());
                        return;
                    }

                    handleNext();

                    setCreation(newCreation);
                    toast.success(t("Pages.Create.Details.saved"));
                    resolve();
                })
                .catch((e) => {
                    toast.error(e.error);
                    reject();
                });
        });
    };
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            className="flex flex-col gap-4 "
        >
            <form.Field
                name="slug"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="slug">{t("Pages.Create.Details.slug")} <Required /></Label>
                        <Input
                            type="text"
                            name="slug"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                                field.handleChange(e.target.value);
                            }}
                            placeholder={t("Pages.Create.Details.slug")}
                        />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )}
                validators={{
                    onSubmit: ({ value }) => {
                        if (value.length < 5) {
                            return t("Pages.Create.Details.slug_too_short")
                        } else if (value.length > 50) {
                            return t("Pages.Create.Details.slug_too_long")
                        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
                            return t("Pages.Create.Details.slug_invalid_characters")
                        }
                    }
                }}
            />
            <form.Field name="creators" children={(field) => (
                <div className="flex flex-col gap-1">
                    <Label htmlFor="creators">{t("Pages.Create.Details.creators")} <Required /></Label>
                    <CreatorInput creators={field.state.value} onChange={field.handleChange} />
                    {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                </div>
            )}
                validators={{
                    onSubmit: ({ value }) => {
                        if (value.length < 1) {
                            return t("Pages.Create.Details.creator_too_short")
                        }
                    }
                }}
            />
            <form.Field
                name="videoUrl"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="videoUrl">{t("Pages.Create.Details.video_url")}</Label>
                        <Input
                            type="text"
                            name="videoUrl"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                                field.handleChange(e.target.value);
                            }}
                            placeholder={t("Pages.Create.Details.video_url")}
                        />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )}
                validators={{
                    onSubmit: ({ value }) => {
                        if (value) {
                            if (!value.includes("https://www.youtube.com/watch?v=") && !value.includes("https://youtu.be/")) {
                                return t("Pages.Create.Details.invalid_video_url")
                            }
                        }
                    }
                }}
            />
            <form.Field
                name="description"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="description">{t("Pages.Create.Details.description")} <Required /></Label>
                        <RichText
                            sendOnChange={(v) => {
                                field.handleChange(v);
                            }}
                            initialValue={creation.description}
                        />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )}
                validators={{
                    onSubmit: ({ value }) => {
                        if (value.length < 50) {
                            return t("Pages.Create.Details.description_too_short")
                        }
                    }
                }}
            />
            <form.Field
                name="tags"
                children={(field) => (
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="tags">{t("Pages.Create.Details.tags")} <Required /></Label>
                        <TagInput
                            tags={tags}
                            creation={creation}
                            onChange={field.handleChange}
                        />
                        {!field.state.meta.isValid && <em role='alert' className='text-red-500'>{field.state.meta.errors.join(', ')}</em>}
                    </div>
                )}
                validators={{
                    onSubmit: ({ value }) => {
                        if (value.length < 1) {
                            return t("Pages.Create.Details.tags_too_short")
                        }
                    }
                }}
            />
            <Button type="submit" className="w-fit">
                <span>{t("Pages.Create.next")}</span>
                <ChevronRight />
            </Button>
        </form>
    );
}

export function CreatorInput({ creators, onChange }: { creators: ICreator[], onChange: (creators: ICreator[]) => void }) {
    const t = useTranslations();
    return (
        <div className="flex flex-col gap-2">
            {creators?.map((creator, index) => (
                <div key={index} className="flex flex-row gap-2 items-center">
                    <CreatorAvatar creator={creator} />
                    <Input type="text" value={creator.username} onChange={(e) => {
                        onChange(creators.map((c, i) => i === index ? { ...c, username: e.target.value } : c))
                    }} placeholder={t("Pages.Create.Details.CreatorInput.username")} />
                    <Input type="text" value={creator.handle} onChange={(e) => {
                        onChange(creators.map((c, i) => i === index ? { ...c, handle: e.target.value } : c))
                    }} placeholder={t("Pages.Create.Details.CreatorInput.handle")} />
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
            }}><Plus /> <span>{t("Pages.Create.Details.CreatorInput.add")}</span></Button>
        </div>
    )
}

export function CreatorAvatar({ creator, size }: { creator: ICreator, size?: number }) {
    const [fullCreator, setFullCreator] = useState<IUser | undefined>(undefined);
    useEffect(() => {
        getCreator(creator.handle ?? creator.username).then((c) => {
            setFullCreator(c);
        })
    }, [creator])
    return (
        <Avatar className={`w-${size ?? 7} h-${size ?? 7}`}>
            <AvatarImage src={fullCreator?.iconURL} />
            <AvatarFallback>
                {(creator.username ?? "Unknown").charAt(0)}
            </AvatarFallback>
        </Avatar>
    )
}

export function TagInput({
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

    useEffect(() => {
        onChange(tagInput);
    }, [tagInput])

    const addTag = (tag: string) => {
        if (tagInput.split(",").includes(tag)) return;
        if (tag.length < 2) return;
        setTagInput(tagInput + "," + tag);
        setSearch("");
    };

    const removeTag = (tag: string) => {
        setTagInput(tagInput.replace("," + tag, ""));
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
                        placeholder={t("Pages.Create.Details.TagInput.placeholder")}
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
                                    {t(`Components.Creations.Tags.${tag as TagKeys}`)}
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

export function TagSearch({
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
                            {t(`Components.Creations.Tags.${tag as TagKeys}`)}
                        </Button>
                    );
                })}
        </div>
    );
}

