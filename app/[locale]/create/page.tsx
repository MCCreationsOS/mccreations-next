"use client";

import {
    convertToCollection,
    createEmptyCreation,
    errorCheckContent,
    requestApproval,
} from "@/app/api/content";
import {useTokenOrKey } from "@/app/api/hooks/users";
import {
    IContentDoc,
} from "@/app/api/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSessionStorage } from "usehooks-ts";
import { CreateBasicInfo, CreateDetails, Files, Images } from "./formElements";
import { useTranslations } from "next-intl";
import Creation from "@/components/Creations/Page/Creation";

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
        let errors = errorCheckContent(creation);
        for(let error of errors) {
            toast.error(t(error.error));
        }

        errors.length === 0 && requestApproval(creation.slug, collectionName, token)
            .then(() => {
                toast.success(t('Pages.Create.submitted'));
                setCreation(createEmptyCreation());
                router.push(`/dashboard`);
            })
            .catch((e) => {
                toast.error(e.error);
            });
    };

    return (
        <div>
            <div className="w-full max-w-3xl mx-auto mt-5 p-4 md:p-5">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                    <TabsList className="w-full h-auto flex-wrap">
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
            {creation.slug && (
                <>
                    <div className="text-2xl font-bold text-center my-10 border-b border-gray-200 pb-2"><h2>Preview</h2></div>
                    <Creation creation={creation} collectionName={collectionName} />
                </>
            )}
        </div>
    );
}

