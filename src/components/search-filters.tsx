"use client"

import { Accordion } from "@radix-ui/react-accordion";
import { useRouter } from "next/navigation"
import { use, useEffect, useState } from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Dropdown } from "./dropdown";
import { useTags } from "@/hooks/creations";

const sortOptions = [
    {label: "Newest", value: "newest"},
    {label: "Updated", value: "updated"},
    {label: "Oldest", value: "oldest"},
    {label: "Most Downloads", value: "most_downloads"},
    {label: "Least Downloads", value: "least_downloads"},
    {label: "Highest Rated", value: "highest_rated"},
    {label: "Lowest Rated", value: "lowest_rated"},
    {label: "Title (A-Z)", value: "title_ascending"},
    {label: "Title (Z-A)", value: "title_descending"},
    {label: "Creator (A-Z)", value: "creator_ascending"},
    {label: "Creator (Z-A)", value: "creator_descending"},
]

export function SearchFilters({searchParams, path}: {searchParams: {
    status?: string;
    sort?: string;
    type?: "maps" | "datapacks" | "resourcepacks" | "marketplace" | "all" | "content";
    includeTags?: string;
    excludeTags?: string;
    minecraftVersion?: string;
    creators?: string;
    search?: string;
    page?: string;
    limit?: string;
}, path: string}) {
    const router = useRouter();
    const [filters, setFilters] = useState<{
        status?: number;
        sort?: string;
        type?: "maps" | "datapacks" | "resourcepacks" | "marketplace" | "all" | "content";
        includeTags?: string[];
        excludeTags?: string[];
        minecraftVersion?: string;
        creators?: string[];
        page?: number;
        limit?: number;
    }>({});
    const {tags} = useTags(searchParams.type || "content");

    useEffect(() => {
        setFilters({
            status: searchParams.status ? parseInt(searchParams.status) : undefined,
            sort: searchParams.sort || "newest",
            type: searchParams.type || "content",
            includeTags: searchParams.includeTags?.split(","),
            excludeTags: searchParams.excludeTags?.split(","),
            minecraftVersion: searchParams.minecraftVersion,
            creators: searchParams.creators?.split(","),
            page: parseInt(searchParams.page || "1"),
            limit: parseInt(searchParams.limit || "20"),
        });
    }, [searchParams]);

    const handleFilterChange = (filter: keyof typeof filters, value: any) => {
        setFilters((prev) => ({...prev, [filter]: value}));
    }

    const handleApplyFilters = () => {
        const queryParams = new URLSearchParams();
        if (filters.status !== undefined) queryParams.set("status", filters.status.toString());
        if (filters.sort) queryParams.set("sort", filters.sort);
        if (filters.type) queryParams.set("type", filters.type);
        if (filters.includeTags) queryParams.set("includeTags", filters.includeTags.join(","));
        if (filters.excludeTags) queryParams.set("excludeTags", filters.excludeTags.join(","));
        if (filters.minecraftVersion) queryParams.set("minecraftVersion", filters.minecraftVersion);
        if (filters.creators) queryParams.set("creators", filters.creators.join(","));
        if (filters.page) queryParams.set("page", filters.page.toString());
        if (filters.limit) queryParams.set("limit", filters.limit.toString());
        
        router.push(`${path}?${queryParams.toString()}`);
    }

    const handleResetFilters = () => {
        router.push(path);
    }

    return (
        <div className="space-y-6">
            <Accordion type="single" collapsible defaultValue={"filters"}>
                <AccordionItem value="filters">
                    <AccordionTrigger>Filters</AccordionTrigger>
                    <AccordionContent>
                        <div className="flex flex-col gap-2">
                            <Label>Status</Label>
                            <Dropdown options={[{label: "All", value: "1"}, {label: "Approved", value: "2"}, {label: "Featured", value: "3"}]} initialValue={filters.status?.toString() || "1"} onChange={(value) => handleFilterChange("status", value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Sort</Label>
                            <Dropdown options={sortOptions} initialValue={filters.sort || "newest"} onChange={(value) => handleFilterChange("sort", value)} />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Type</Label>
                            <Dropdown options={[{label: "All", value: "content"}, {label: "Maps", value: "maps"}, {label: "Datapacks", value: "datapacks"}, {label: "Resourcepacks", value: "resourcepacks"}]} initialValue={filters.type || "content"} onChange={(value) => handleFilterChange("type", value)} />
                        </div>

                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}
