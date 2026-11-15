import { getMinecraftVersions } from "@/app/api/minecraftVersions"
import { IFile } from "@/app/api/types"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Input } from "../ui/input"
import { Button } from "../ui/button"

export function isBedrockType(type: string) {
    return type === "bedrock_map" || type === 'bedrock_resourcepack' || type === "addon" || type === "behavior_pack"
}

/** Orders versions newest last: releases by number (1.20.4 < 1.21), snapshots (24w14a) by year/week */
function compareMinecraftVersions(a: string, b: string) {
    const snapshot = /^(\d+)w(\d+)([a-z]?)$/i
    const sa = a.match(snapshot), sb = b.match(snapshot)
    if (sa && sb) {
        return Number(sa[1]) - Number(sb[1]) || Number(sa[2]) - Number(sb[2]) || sa[3].localeCompare(sb[3])
    }
    if (sa) return 1
    if (sb) return -1
    const pa = a.split(/[.\-]/).map((part) => parseInt(part) || 0)
    const pb = b.split(/[.\-]/).map((part) => parseInt(part) || 0)
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pa[i] ?? 0) - (pb[i] ?? 0)
        if (diff !== 0) return diff
    }
    return a.localeCompare(b)
}

export default function MinecraftVersionInput({
    version,
    onChange,
}: {
    version: string;
    onChange: (version: string) => void;
}) {
    const initial = version.split(",").filter((v) => v.length > 0);
    const [selected, setSelected] = useState<string[]>(initial.filter((v) => v.length > 0));
    const [search, setSearch] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    // Wait for typing to pause before asking the API
    const [debouncedSearch] = useDebounceValue(search, 300);
    const [results, setResults] = useState<string[]>([]);
    const t = useTranslations();

    useEffect(() => {
        let cancelled = false
        getMinecraftVersions(debouncedSearch, ["release", "snapshot"]).then((versions) => {
            if (cancelled) return
            const ids: string[] = (versions?.documents ?? []).map((v: any) => v.id)
            setResults(ids.filter((id) => id.toLowerCase().includes(debouncedSearch.toLowerCase())))
        }).catch(() => {
            if (!cancelled) setResults([])
        })
        return () => { cancelled = true }
    }, [debouncedSearch])

    // Only suggest results for what's in the box right now, never a stale list
    const matches = debouncedSearch === search ? results.filter((v) => !selected.includes(v)) : []

    const update = (next: string[]) => {
        setSelected(next);
        onChange(next.join(","));
    };

    const addVersion = (value: string) => {
        if (value.length < 2 || selected.includes(value)) return;
        update([...selected, value].sort(compareMinecraftVersions));
        setSearch("");
    };

    const removeVersion = (value: string) => {
        update(selected.filter((v) => v !== value));
    };

    return (
        <Popover onOpenChange={setShowSuggestions} open={showSuggestions}>
            <PopoverTrigger asChild>
                <div className="flex flex-row flex-wrap gap-2 px-2 py-1 border overflow-auto">
                    <Input
                        className="border-none min-w-[100px] flex-1"
                        type="text"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                const value = search.trim();
                                if (!value) return;
                                // Prefer an exact match, then the top suggestion, then what was typed
                                addVersion(matches.includes(value) ? value : matches[0] ?? value);
                            }
                        }}
                        placeholder={t('Components.VersionManager.Version.search_placeholder')}
                        aria-label={t('Components.VersionManager.Version.minecraft_version')}
                    />
                    {selected.map((v) => (
                        <Button
                            type="button"
                            variant="ghost"
                            key={v}
                            className="text-sm border py-0 px-2"
                            onClick={() => removeVersion(v)}
                        >
                            {v} ×
                        </Button>
                    ))}
                </div>
            </PopoverTrigger>
            <PopoverContent
                onOpenAutoFocus={(e) => {
                    e.preventDefault();
                }}
                className="max-h-[25vh] overflow-y-auto"
            >
                <div className="flex flex-wrap gap-2 border-2 border-white/15 p-1">
                    {matches.map((v) => (
                        <Button
                            type="button"
                            variant="ghost"
                            key={v}
                            className="text-sm border py-0 px-2"
                            onClick={() => addVersion(v)}
                        >
                            {v}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
