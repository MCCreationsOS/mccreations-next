"use client";

import { Sun, Moon } from "lucide-react";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

export default function ThemeSwitch() {
    const t = useTranslations();
    const {theme, setTheme} = useTheme();
    return (
        <div className="flex items-center gap-2 mt-4">
            <Sun className="w-4 h-4" />
            <p className="sr-only">{t("ThemeSwitch.sun")}</p>
            <Switch checked={theme === "dark"} onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")} />
            <p className="sr-only">{t("ThemeSwitch.moon")}</p>
            <Moon className="w-4 h-4" />
        </div>
    )
}
