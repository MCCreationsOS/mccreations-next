import { Static, Type } from "@sinclair/typebox";

export const TContentType = Type.Enum({
    MAP: "map",
    DATAPACK: "datapack",
    RESOURCEPACK: "resourcepack",
    MARKETPLACE: "marketplace"
})

export type ContentType = Static<typeof TContentType>

export const TCollectionName = Type.Enum({
    MAPS: "Maps",
    DATAPACKS: "datapacks",
    RESOURCEPACKS: "resourcepacks",
    MARKETPLACE: "marketplace"
})

export type CollectionName = Static<typeof TCollectionName>

export const TStatus = Type.Enum({
    DRAFT: 0,
    PENDING: 1,
    APPROVED: 2,
    FEATURED: 3,
    REJECTED: 4
})

export type Status = Static<typeof TStatus>

export const TFileType = Type.Enum({
    WORLD: "world",
    RESOURCE: "resource",
    DATA: "data",
    BEDROCK_WORLD: "bedrock_world",
    BEDROCK_RESOURCE: "bedrock_resource",
    BEDROCK_DATA: "bedrock_data",
    ADDON: "addon"
})

export type FileType = Static<typeof TFileType>


export enum UserTypes {
    Account,
    Creator,
    Admin
}

export const NotificationOption = Type.Union([Type.Literal("push_only"), Type.Literal("push_email_daily"), Type.Literal("push_email_weekly"), Type.Literal("email_daily"), Type.Literal("email_weekly"), Type.Literal("dashboard_only"), Type.Literal("none")])

export const SocialLink = Type.Object({
    link: Type.String(),
    name: Type.String()
})

export const ProfileLayout = Type.Object({
    widgets: Type.Array(Type.Any()),
    layout: Type.Array(Type.Any())
})

export const UserSettings = Type.Object({
    notifications: Type.Object({
        comment: NotificationOption,
        like: NotificationOption,
        reply: NotificationOption,
        follow: NotificationOption,
        rating: NotificationOption,
        translation: NotificationOption
    })
})

export type UserSettings = Static<typeof UserSettings>
export const User = Type.Object({
    _id: Type.String(),
    type: Type.Enum(UserTypes),
    username: Type.String(),
    email: Type.Lowercase(Type.String()),
    handle: Type.Lowercase(Type.Optional(Type.String())),
    iconURL: Type.Optional(Type.String()),
    bannerURL: Type.Optional(Type.String()),
    socialLinks: Type.Optional(Type.Array(SocialLink)),
    owners: Type.Optional(Type.Array(Type.String())),
    profileLayout: Type.Optional(ProfileLayout),
    settings: Type.Optional(UserSettings),
    following: Type.Optional(Type.Array(Type.String())),
    followers: Type.Optional(Type.Array(Type.String()))
})

export type UserType = Static<typeof User>

export const CommentType = Type.Enum({
    MAPS: "maps",
    DATAPACKS: "datapacks",
    RESOURCEPACKS: "resourcepacks",
    WALL: "wall"
})

export type CommentType = Static<typeof CommentType>

const SubComment = Type.Object({
    _id: Type.String(),
    username: Type.String(),
    handle: Type.Optional(Type.String()),
    comment: Type.String(),
    createdDate: Type.Number(),
    updatedDate: Type.Optional(Type.Number()),
    approved: Type.Boolean(),
    content_type: CommentType,
    slug: Type.String(),
    likes: Type.Number()
})

export const TComment = Type.Object({
    ...SubComment.properties,
    replies: Type.Array(SubComment)
})

export type Comment = Static<typeof TComment>

export const TExtraFile = Type.Object({
    type: TFileType,
    url: Type.String(),
    required: Type.Boolean()
})

export type ExtraFile = Static<typeof TExtraFile>

export const TFile = Type.Object({
    type: TFileType,
    url: Type.String(),
    worldUrl: Type.Optional(Type.String()),
    resourceUrl: Type.Optional(Type.String()),
    dataUrl: Type.Optional(Type.String()),
    minecraftVersion: Type.Array(Type.String()),
    contentVersion: Type.Optional(Type.String()),
    changelog: Type.Optional(Type.String()),
    extraFiles: Type.Optional(Type.Array(TExtraFile)),
    createdDate: Type.Date()
})

export type File = Static<typeof TFile>

export const TCreation = Type.Object({
    _id: Type.String(),
    title: Type.String(),
    type: TContentType,
    rating: Type.Number(),
    ratings: Type.Array(Type.Number()),
    createdDate: Type.Date(),
    updatedDate: Type.Date(),
    views: Type.Number(),
    downloads: Type.Number(),
    shortDescription: Type.String(),
    description: Type.String(),
    images: Type.Array(Type.String()),
    tags: Type.Array(Type.String()),
    videoUrl: Type.Optional(Type.String()),
    creators: Type.Array(User),
    slug: Type.String(),
    extraFeatures: Type.Optional(Type.Record(Type.String(), Type.Any())),
    files: Type.Optional(Type.Array(TFile)),
    importedUrl: Type.Optional(Type.String()),
    status: Type.Number(),
    owner: Type.Optional(Type.String()),
    key: Type.Optional(Type.String())
})


export type Creation = Static<typeof TCreation>

export const TSort = Type.Enum({
    NEWEST: "newest",
    OLDEST: "oldest",
    UPDATED: "updated",
    TITLE_ASCENDING: "title_ascending",
    TITLE_DESCENDING: "title_descending",
    CREATOR_ASCENDING: "creator_ascending",
    CREATOR_DESCENDING: "creator_descending",
    HIGHEST_RATED: "highest_rated",
    LOWEST_RATED: "lowest_rated",
    MOST_DOWNLOADED: "most_downloaded",
    LEAST_DOWNLOADED: "least_downloaded"
})

export type Sort = Static<typeof TSort>

export interface WithCountResponse<T> {
    documents: T[],
    totalCount: number,
    error?: string
}

export interface MapTags {
    genre: string[],
    subgenre: string[],
    difficulty: string[],
    theme: string[],
    length: string[],
}

export interface DatapackTags {
    genre: string[],
    subgenre: string[],
    difficulty: string[],
    theme: string[],
}

export interface ResourcepackTags {
    genre: string[],
    subgenre: string[],
    resolution: string[],
    theme: string[],
}

export interface MarketplaceTags {
    genre: string[],
    subgenre: string[],
    theme: string[],
    difficulty: string[],
    length: string[],
}

export type Tags = MapTags | DatapackTags | ResourcepackTags | MarketplaceTags
