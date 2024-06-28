/** 
 * All sort options supported by the API
 * @Newest Sort by created date descending
 * @Oldest Sort by created date ascending
 * @Updated Sort by updated date descending
 * @TitleAscending Sort by title ascending
 * @TitleDescending Sort by title descending
 * @HighestRated Sort by rating (not ratings) descending
 * @LowestRated Sort by rating ascending
 * @CreatorAscending Sort by creator name ascending. Sorts by first creator, then second, etc.
 * @CreatorDescending Sort by creator name descending
 * @BestMatch Sort by textScore parameter when doing a text search. Not correctly implemented atm.
*/
export enum SortOptions {
    Newest = "newest",
    Oldest = "oldest",
    Updated = "updated",
    TitleAscending = "title_ascending",
    TitleDescending = "title_descending",
    HighestRated = "highest_rated",
    LowestRated = "lowest_rated",
    CreatorAscending = "creator_ascending",
    CreatorDescending = "creator_descending",
    BestMatch = "best_match",
    HighestDownloads = "highest_downloads",
    LowestDownloads = "lowest_downloads"
}

export enum StatusOptions {
    Draft,
    Unapproved,
    Approved,
    Featured
}

/**
 * Options to send to the API when doing a query
 * @limit number of documents to return
 * @skip number of documents to skip. Skip 20 returns maps 20-40 for example.
 * @featured Only return maps that are featured (status: 3). Should be replaced with a status query
 * @sort Which option to use when sorting
 * @search A text string to search by. Searches the title, short description and creator names. 
 * 
 * If any information is not provided it will be filled in with default values when performing a query
 * instead of being left undefined. 
 */
export interface QueryOptions {
    limit?: number;
    page?: number;
    status?: number;
    sort?: SortOptions;
    search?: string;
    includeTags?: string,
    excludeTags?: string,
    exclusiveStatus?: boolean,
    contentType: ContentTypes | "content"
}

export interface ErrorMessage {
    error: unknown,
    query: string | QueryOptions
}

export enum ContentTypes {
    Maps = "Maps",
    Datapacks = "datapacks",
    Resourcepacks = "resourcepacks"
}

/**
 * Represents the map object returned by the database
 * @comments An array of comments
 * @creators An array of creators
 * @description A string representing the long description that appears on the map page. Includes HTML tags
 * @files An array of files
 * @images An array of Image URLs as strings. The first will be used as the maps logo
 * @shortDescription A short description to be shown on the Maps card. Does not include HTML tags
 * @slug The URL slug used to access the map
 * @status The status of the map. 0 = draft, 1 = waiting for approval, 2 = approved, 3 = featured
 * @title The title of the map
 * @videoUrl A link to a youtube video to be featured on the map page. Usually the maps trailer
 * @downloads The number of downloads the map has **Not implemented**
 * @views The number of views the maps page has. **Not implemented**
 * @rating The rating of the map in a decimal. 0 = 0 stars, 1 = 5 stars
 * @ratings A list of all ratings on the map
 * @createdDate The date the map was added to the site
 * @updatedDate The date the map was last updated on the site. Will be 12/31/1969 if it has not been updated
 * @_id The Object ID of the map. Not currently used, but required by MongoDB
 */
export interface IContentDoc {
    comments?: IComment[],
    creators: ICreator[],
    description: string,
    files: IFile[],
    images: string[],
    shortDescription: string,
    slug: string,
    status: number,
    title: string,
    videoUrl: string | undefined,
    downloads: number,
    views: number,
    rating: number,
    ratings?: number[],
    createdDate: number,
    updatedDate?: number,
    _id: any,
    tags: string[]
}

/**
 * Represents the creator object returned by the database
 * @username The username of the creator
 * @icon A URL to the icon of the creator **Not currently implemented**
 */
export interface ICreator {
    username: string,
    handle?: string,
    selected?: boolean,
}

/**
 * Represents the comment object returned by the database
 * @username The username of the user who submitted the comment
 * @icon The icon of the user who submitted the comment **Not implemented**
 * @comment The comment text
 * @date The date the comment was sent
 */
export interface IComment {
    username: string,
    handle?: string,
    comment: string,
    date: number,
    approved: boolean
}

/**
 * Represents the file object returned by the database
 * @type What type of file this is **Not implemented**
 * @worldUrl A URL to the download of the world
 * @resourceUrl A URL to the download of the resourcepack
 * @dataUrl A URL to the download of the datapack. May be used for automatic map updating in the far future
 * @minecraftVersion The Minecraft Version this file is for
 * @contentVersion The version of the content this file is for
 */
export interface IFile {
    type: string,
    worldUrl: string,
    resourceUrl?: string,
    dataUrl?: string,
    minecraftVersion: string,
    contentVersion: string
}

export interface IUser {
    _id?: string
    type: UserTypes
    username: string,
    email: string,
    password?: string,
    handle?: string,
    iconURL?: string,
    about?: string,
    bannerURL?: string,
    socialLinks?: [{
        link: string,
        name: string
    }]
}

export enum UserTypes {
    Account,
    Creator,
    Admin
}

export interface FilePreview {
    preview?: string,
    file?: File,
    name: string
}

export interface Tags {
    genre: string[],
    subgenre: string[],
    [key: string]: string[]
}

/**
 * An enum representing all existing Minecraft Versions.
 */
export enum MinecraftVersion {
    "23w45a",
    "23w44a",
    "23w43b",
    "23w43a",
    "23w42a",
    "23w41a",
    "23w40a",
    "1.20.2",
    "1.20.2-rc2",
    "1.20.2-rc1",
    "1.20.2-pre4",
    "1.20.2-pre3",
    "1.20.2-pre2",
    "1.20.2-pre1",
    "23w35a",
    "23w33a",
    "23w32a",
    "23w31a",
    "1.20.1",
    "1.20.1-rc1",
    "1.20",
    "1.20-rc1",
    "1.20-pre7",
    "1.20-pre6",
    "1.20-pre5",
    "1.20-pre4",
    "1.20-pre3",
    "1.20-pre2",
    "1.20-pre1",
    "23w18a",
    "23w17a",
    "23w16a",
    "23w14a",
    "23w13a_or_b",
    "23w13a",
    "23w12a",
    "1.19.4",
    "1.19.4-rc3",
    "1.19.4-rc2",
    "1.19.4-rc1",
    "1.19.4-pre4",
    "1.19.4-pre3",
    "1.19.4-pre2",
    "1.19.4-pre1",
    "23w07a",
    "23w06a",
    "23w05a",
    "23w04a",
    "23w03a",
    "1.19.3",
    "1.19.3-rc3",
    "1.19.3-rc2",
    "1.19.3-rc1",
    "1.19.3-pre3",
    "1.19.3-pre2",
    "1.19.3-pre1",
    "22w46a",
    "22w45a",
    "22w44a",
    "22w43a",
    "22w42a",
    "1.19.2",
    "1.19.2-rc2",
    "1.19.2-rc1",
    "1.19.1",
    "1.19.1-rc3",
    "1.19.1-rc2",
    "1.19.1-pre6",
    "1.19.1-pre5",
    "1.19.1-pre4",
    "1.19.1-pre3",
    "1.19.1-pre2",
    "1.19.1-rc1",
    "1.19.1-pre1",
    "22w24a",
    "1.19.0",
    "1.19-rc2",
    "1.19-rc1",
    "1.19-pre5",
    "1.19-pre4",
    "1.19-pre3",
    "1.19-pre2",
    "1.19-pre1",
    "22w19a",
    "22w18a",
    "22w17a",
    "22w16b",
    "22w16a",
    "22w15a",
    "22w14a",
    "22w13oneblockatatime",
    "22w13a",
    "22w12a",
    "22w11a",
    "1.18.2",
    "1.18.2-rc1",
    "1.18.2-pre3",
    "1.18.2-pre2",
    "1.18.2-pre1",
    "22w07a",
    "22w06a",
    "22w05a",
    "22w03a",
    "1.18.1",
    "1.18.1-rc3",
    "1.18.1-rc2",
    "1.18.1-rc1",
    "1.18.1-pre1",
    "1.18.0",
    "1.18-rc4",
    "1.18-rc3",
    "1.18-rc2",
    "1.18-rc1",
    "1.18-pre8",
    "1.18-pre7",
    "1.18-pre6",
    "1.18-pre5",
    "1.18-pre4",
    "1.18-pre3",
    "1.18-pre2",
    "1.18-pre1",
    "21w44a",
    "21w43a",
    "21w42a",
    "21w41a",
    "21w40a",
    "21w39a",
    "21w38a",
    "21w37a",
    "1.17.1",
    "1.17.1-rc2",
    "1.17.1-rc1",
    "1.17.1-pre3",
    "1.17.1-pre2",
    "1.17.1-pre1",
    "1.17.0",
    "1.17-rc2",
    "1.17-rc1",
    "1.17-pre5",
    "1.17-pre4",
    "1.17-pre3",
    "1.17-pre2",
    "1.17-pre1",
    "21w20a",
    "21w19a",
    "21w18a",
    "21w17a",
    "21w16a",
    "21w15a",
    "21w14a",
    "21w13a",
    "21w11a",
    "21w10a",
    "21w08b",
    "21w08a",
    "21w07a",
    "21w06a",
    "21w05b",
    "21w05a",
    "21w03a",
    "1.16.5",
    "1.16.5-rc1",
    "20w51a",
    "20w49a",
    "20w48a",
    "20w46a",
    "20w45a",
    "1.16.4",
    "1.16.4-rc1",
    "1.16.4-pre2",
    "1.16.4-pre1",
    "1.16.3",
    "1.16.3-rc1",
    "1.16.2",
    "1.16.2-rc2",
    "1.16.2-rc1",
    "1.16.2-pre3",
    "1.16.2-pre2",
    "1.16.2-pre1",
    "20w30a",
    "20w29a",
    "20w28a",
    "20w27a",
    "1.16.1",
    "1.16.0",
    "1.16-rc1",
    "1.16-pre8",
    "1.16-pre7",
    "1.16-pre6",
    "1.16-pre5",
    "1.16-pre4",
    "1.16-pre3",
    "1.16-pre2",
    "1.16-pre1",
    "20w22a",
    "20w21a",
    "20w20b",
    "20w20a",
    "20w19a",
    "20w18a",
    "20w17a",
    "20w16a",
    "20w15a",
    "20w14a",
    "20w14infinite",
    "20w13b",
    "20w13a",
    "20w12a",
    "20w11a",
    "20w10a",
    "20w09a",
    "20w08a",
    "20w07a",
    "20w06a",
    "1.15.2",
    "1.15.2-pre2",
    "1.15.2-pre1",
    "1.15.1",
    "1.15.1-pre1",
    "1.15.0",
    "1.15-pre7",
    "1.15-pre6",
    "1.15-pre5",
    "1.15-pre4",
    "1.15-pre3",
    "1.15-pre2",
    "1.15-pre1",
    "19w46b",
    "19w46a",
    "19w45b",
    "19w45a",
    "19w44a",
    "19w42a",
    "19w41a",
    "19w40a",
    "19w39a",
    "19w38b",
    "19w38a",
    "19w37a",
    "19w36a",
    "19w35a",
    "19w34a",
    "1.14.4",
    "1.14.4-pre7",
    "1.14.4-pre6",
    "1.14.4-pre5",
    "1.14.4-pre4",
    "1.14.4-pre3",
    "1.14.4-pre2",
    "1.14.4-pre1",
    "1.14.3",
    "1.14.3-pre4",
    "1.14.3-pre3",
    "1.14.3-pre2",
    "1.14.3-pre1",
    "1.14.2",
    "1.14.2 Pre-Release 4",
    "1.14.2 Pre-Release 3",
    "1.14.2 Pre-Release 2",
    "1.14.2 Pre-Release 1",
    "1.14.1",
    "1.14.1 Pre-Release 2",
    "1.14.1 Pre-Release 1",
    "1.14.0",
    "1.14 Pre-Release 5",
    "1.14 Pre-Release 4",
    "1.14 Pre-Release 3",
    "1.14 Pre-Release 2",
    "1.14 Pre-Release 1",
    "19w14b",
    "19w14a",
    "3D Shareware v1.34",
    "19w13b",
    "19w13a",
    "19w12b",
    "19w12a",
    "19w11b",
    "19w11a",
    "19w09a",
    "19w08b",
    "19w08a",
    "19w07a",
    "19w06a",
    "19w05a",
    "19w04b",
    "19w04a",
    "19w03c",
    "19w03b",
    "19w03a",
    "19w02a",
    "18w50a",
    "18w49a",
    "18w48b",
    "18w48a",
    "18w47b",
    "18w47a",
    "18w46a",
    "18w45a",
    "18w44a",
    "18w43c",
    "18w43b",
    "18w43a",
    "1.13.2",
    "1.13.2-pre2",
    "1.13.2-pre1",
    "1.13.1",
    "1.13.1-pre2",
    "1.13.1-pre1",
    "18w33a",
    "18w32a",
    "18w31a",
    "18w30b",
    "18w30a",
    "1.13.0",
    "1.13-pre10",
    "1.13-pre9",
    "1.13-pre8",
    "1.13-pre7",
    "1.13-pre6",
    "1.13-pre5",
    "1.13-pre4",
    "1.13-pre3",
    "1.13-pre2",
    "1.13-pre1",
    "18w22c",
    "18w22b",
    "18w22a",
    "18w21b",
    "18w21a",
    "18w20c",
    "18w20b",
    "18w20a",
    "18w19b",
    "18w19a",
    "18w16a",
    "18w15a",
    "18w14b",
    "18w14a",
    "18w11a",
    "18w10d",
    "18w10c",
    "18w10b",
    "18w10a",
    "18w09a",
    "18w08b",
    "18w08a",
    "18w07c",
    "18w07b",
    "18w07a",
    "18w06a",
    "18w05a",
    "18w03b",
    "18w03a",
    "18w02a",
    "18w01a",
    "17w50a",
    "17w49b",
    "17w49a",
    "17w48a",
    "17w47b",
    "17w47a",
    "17w46a",
    "17w45b",
    "17w45a",
    "17w43b",
    "17w43a",
    "1.12.2",
    "1.12.2-pre2",
    "1.12.2-pre1",
    "1.12.1",
    "1.12.1-pre1",
    "17w31a",
    "1.12.0",
    "1.12-pre7",
    "1.12-pre6",
    "1.12-pre5",
    "1.12-pre4",
    "1.12-pre3",
    "1.12-pre2",
    "1.12-pre1",
    "17w18b",
    "17w18a",
    "17w17b",
    "17w17a",
    "17w16b",
    "17w16a",
    "17w15a",
    "17w14a",
    "17w13b",
    "17w13a",
    "17w06a",
    "1.11.2",
    "1.11.1",
    "16w50a",
    "1.11.0",
    "1.11-pre1",
    "16w44a",
    "16w43a",
    "16w42a",
    "16w41a",
    "16w40a",
    "16w39c",
    "16w39b",
    "16w39a",
    "16w38a",
    "16w36a",
    "16w35a",
    "16w33a",
    "16w32b",
    "16w32a",
    "1.10.2",
    "1.10.1",
    "1.10",
    "1.10-pre2",
    "1.10-pre1",
    "16w21b",
    "16w21a",
    "16w20a",
    "1.9.4",
    "1.9.3",
    "1.9.3-pre3",
    "1.9.3-pre2",
    "1.9.3-pre1",
    "16w15b",
    "16w15a",
    "16w14a",
    "1.RV-Pre1",
    "1.9.2",
    "1.9.1",
    "1.9.1-pre3",
    "1.9.1-pre2",
    "1.9.1-pre1",
    "1.9.0",
    "1.9-pre4",
    "1.9-pre3",
    "1.9-pre2",
    "1.9-pre1",
    "16w07b",
    "16w07a",
    "16w06a",
    "16w05b",
    "16w05a",
    "16w04a",
    "16w03a",
    "16w02a",
    "15w51b",
    "15w51a",
    "15w50a",
    "15w49b",
    "1.8.9",
    "15w49a",
    "15w47c",
    "15w47b",
    "15w47a",
    "15w46a",
    "15w45a",
    "15w44b",
    "15w44a",
    "15w43c",
    "15w43b",
    "15w43a",
    "15w42a",
    "15w41b",
    "15w41a",
    "15w40b",
    "15w40a",
    "15w39c",
    "15w39b",
    "15w39a",
    "15w38b",
    "15w38a",
    "15w37a",
    "15w36d",
    "15w36c",
    "15w36b",
    "15w36a",
    "15w35e",
    "15w35d",
    "15w35c",
    "15w35b",
    "15w35a",
    "15w34d",
    "15w34c",
    "15w34b",
    "15w34a",
    "15w33c",
    "15w33b",
    "15w33a",
    "15w32c",
    "15w32b",
    "15w32a",
    "15w31c",
    "15w31b",
    "15w31a",
    "1.8.8",
    "1.8.7",
    "1.8.6",
    "1.8.5",
    "1.8.4",
    "15w14a",
    "1.8.3",
    "1.8.2",
    "1.8.2-pre7",
    "1.8.2-pre6",
    "1.8.2-pre5",
    "1.8.2-pre4",
    "1.8.2-pre3",
    "1.8.2-pre2",
    "1.8.2-pre1",
    "1.8.1",
    "1.8.1-pre5",
    "1.8.1-pre4",
    "1.8.1-pre3",
    "1.8.1-pre2",
    "1.8.1-pre1",
    "1.8.0",
    "1.8-pre3",
    "1.8-pre2",
    "1.8-pre1",
    "14w34d",
    "14w34c",
    "14w34b",
    "14w34a",
    "14w33c",
    "14w33b",
    "14w33a",
    "14w32d",
    "14w32c",
    "14w32b",
    "14w32a",
    "14w31a",
    "14w30c",
    "14w30b",
    "14w30a",
    "14w29b",
    "14w29a",
    "14w28b",
    "14w28a",
    "14w27b",
    "14w27a",
    "14w26c",
    "14w26b",
    "14w26a",
    "14w25b",
    "14w25a",
    "14w21b",
    "14w21a",
    "14w20b",
    "14w20a",
    "1.7.10",
    "1.7.10-pre4",
    "1.7.10-pre3",
    "1.7.10-pre2",
    "1.7.10-pre1",
    "14w19a",
    "14w18b",
    "14w18a",
    "14w17a",
    "14w11b",
    "1.7.9",
    "1.7.8",
    "1.7.7",
    "1.7.6",
    "14w11a",
    "1.7.6-pre2",
    "1.7.6-pre1",
    "14w10c",
    "14w10b",
    "14w10a",
    "14w08a",
    "1.7.5",
    "14w07a",
    "14w06b",
    "14w06a",
    "14w05b",
    "14w05a",
    "14w04b",
    "14w04a",
    "14w03b",
    "14w03a",
    "14w02c",
    "14w02b",
    "14w02a",
    "1.7.4",
    "1.7.3",
    "13w49a",
    "13w48b",
    "13w48a",
    "13w47e",
    "13w47d",
    "13w47c",
    "13w47b",
    "13w47a",
    "1.7.2",
    "1.7.1",
    "1.7.0",
    "13w43a",
    "13w42b",
    "13w42a",
    "13w41b",
    "13w41a",
    "13w39b",
    "13w39a",
    "13w38c",
    "13w38b",
    "13w38a",
    "1.6.4",
    "13w37b",
    "1.6.3",
    "13w37a",
    "13w36b",
    "13w36a",
    "1.6.2",
    "1.6.1",
    "1.6.0",
    "13w26a",
    "13w25c",
    "13w25b",
    "13w25a",
    "13w24b",
    "13w24a",
    "13w23b",
    "13w23a",
    "13w22a",
    "13w21b",
    "13w21a",
    "13w19a",
    "13w18c",
    "13w18b",
    "13w18a",
    "13w17a",
    "1.5.2",
    "13w16b",
    "13w16a",
    "1.5.1",
    "1.5.0",
    "1.4.7",
    "1.4.5",
    "1.4.6",
    "1.4.4",
    "1.4.3",
    "1.4.2",
    "1.4.1",
    "1.4.0",
    "1.3.2",
    "1.3.1",
    "1.3.0",
    "1.2.5",
    "1.2.4",
    "1.2.3",
    "1.2.2",
    "1.2.1",
    "1.1.0",
    "1.0",
    "b1.8.1",
    "b1.8",
    "b1.7.3",
    "b1.7.2",
    "b1.7",
    "b1.6.6",
    "b1.6.5",
    "b1.6.4",
    "b1.6.3",
    "b1.6.2",
    "b1.6.1",
    "b1.6",
    "b1.5_01",
    "b1.5",
    "b1.4_01",
    "b1.4",
    "b1.3_01",
    "b1.3b",
    "b1.2_02",
    "b1.2_01",
    "b1.2",
    "b1.1_02",
    "b1.1_01",
    "b1.0.2",
    "b1.0_01",
    "b1.0",
    "a1.2.6",
    "a1.2.5",
    "a1.2.4_01",
    "a1.2.3_04",
    "a1.2.3_02",
    "a1.2.3_01",
    "a1.2.3",
    "a1.2.2b",
    "a1.2.2a",
    "a1.2.1_01",
    "a1.2.1",
    "a1.2.0_02",
    "a1.2.0_01",
    "a1.2.0",
    "a1.1.2_01",
    "a1.1.2",
    "a1.1.0",
    "a1.0.17_04",
    "a1.0.17_02",
    "a1.0.16",
    "a1.0.15",
    "a1.0.14",
    "a1.0.11",
    "a1.0.5_01",
    "a1.0.4",
    "inf-20100618",
    "c0.30_01c",
    "c0.0.13a",
    "c0.0.13a_03",
    "c0.0.11a",
    "rd-161348",
    "rd-160052",
    "rd-20090515",
    "rd-132328",
    "rd-132211"
}