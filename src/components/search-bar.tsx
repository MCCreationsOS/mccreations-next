"use client";

import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";

export function SearchBar({path, initialValue}: {path: string, initialValue?: string}) {
    const router = useRouter();
    const [search, setSearch] = useState(initialValue || "");

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`${path}?search=${search}`);
    }

    return (
        <div className="flex items-center">
            <form onSubmit={handleSubmit} className="relative w-full">
                <Input
                    type="search"
                    placeholder="Search"
                    className="w-full rounded-lg border-none shadow-none pr-12 p-2"
                    value={search}
                    onChange={handleSearch}
                />
                <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2">
                    <Search className="w-4 h-4" />
                </Button>
            </form>
        </div>
    )
}
