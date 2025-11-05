"use client";

import {
    convertToCollection,
    createEmptyCreation,
    requestApproval,
} from "@/app/api/content";
import {useTokenOrKey } from "@/app/api/hooks/users";
import {
    IContentDoc,
} from "@/app/api/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStorage } from "usehooks-ts";
import { CreateBasicInfo, CreateDetails, Files, Images } from "./formElements";
import { useTranslations } from "next-intl";

export default function Page() {
    const [creation, setCreation] = useSessionStorage<IContentDoc>(
        "tempCreation",
        createEmptyCreation()
    );
    const [activeTab, setActiveTab] = useState("basic_info");
    const { token } = useTokenOrKey();
    const [tabsDisabled, setTabsDisabled] = useState(true);

    const contentType = creation.type;
    const collectionName = convertToCollection(contentType);
    const router = useRouter();
    const t = useTranslations();

    useEffect(() => {

        return (() => {
            console.log("Clearing Temp Creation")
            sessionStorage.removeItem("tempCreation")
        })
    }, [])

    const handleTabChange = (tab: string) => {
        // Save the current form before changing the active tab
        setActiveTab(tab);
    };

    const handleNext = () => {
        if (activeTab === "basic_info") {
            setActiveTab("details");
            setTabsDisabled(false)
        } else if (activeTab === "details") {
            setActiveTab("files");
        } else if (activeTab === "files") {
            setActiveTab("images");
        } else if (activeTab === "images") {
            onFinish();
        }
    };

    const onFinish = () => {
        if (!creation || "error" in creation) return;
        requestApproval(creation.slug, collectionName, token)
            .then(() => {
                setCreation(createEmptyCreation());
                router.push(`/dashboard`);
            })
            .catch((e) => {
                toast.error(e.error);
            });
    };

    return (
        <div className="w-1/2 mx-auto mt-5 p-5">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="w-full">
                    <TabsTrigger value="basic_info" className="w-1/4">{t('Pages.Create.BasicInfo.title')}</TabsTrigger>
                    <TabsTrigger value="details" className="w-1/4" disabled={tabsDisabled}>{t('Pages.Create.Details.title')}</TabsTrigger>
                    <TabsTrigger value="files" className="w-1/4" disabled={tabsDisabled}>{t('Pages.Create.Files.title')}</TabsTrigger>
                    <TabsTrigger value="images" className="w-1/4" disabled={tabsDisabled}>{t('Pages.Create.Images.title')}</TabsTrigger>
                </TabsList>
                <TabsContent value="basic_info">
                    <CreateBasicInfo handleNext={handleNext} />
                </TabsContent>
                <TabsContent value="details">
                    <CreateDetails handleNext={handleNext} />
                </TabsContent>
                <TabsContent value="files">
                    <Files handleNext={handleNext} />
                </TabsContent>
                <TabsContent value="images">
                    <Images handleNext={handleNext} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

