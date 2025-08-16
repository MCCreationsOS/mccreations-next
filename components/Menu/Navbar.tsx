"use client";

import { Link } from "@/i18n/navigation";
import { Menu, Upload, User } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "../ui/sheet";
import { Button } from "../ui/button";
import Image from "next/image";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "../ui/navigation-menu";
import UserOptions from "./UserOptions";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function Navbar() {
    const t = useTranslations();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center px-2">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">{t("Components.Navbar.toggle_menu")}</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-4 border-2 border-white/15">
                        <Link href="/" className="flex items-center gap-2 mb-8">
                            <div className="relative w-8 h-8">
                                <Image
                                    src="/mcc_more_scaffold_cube.png"
                                    alt="MCCreations Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-bold text-xl">
                                MCCreations
                            </span>
                        </Link>
                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                {t("Components.Navbar.home")}
                            </Link>
                            <Link href="/feed" className="text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>
                                {t("Components.Navbar.feed")}
                            </Link>
                            <Link
                                href="/maps"
                                className="text-lg font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("Components.Navbar.Creations.maps")}
                            </Link>
                            <Link
                                href="/datapacks"
                                className="text-lg font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("Components.Navbar.Creations.datapacks")}
                            </Link>
                            <Link
                                href="/resourcepacks"
                                className="text-lg font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("Components.Navbar.Creations.resourcepacks")}
                            </Link>
                            <Link
                                href="/create"
                                className="text-lg font-medium"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {t("Components.Navbar.create")}
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                <Link href="/" className="mr-6 flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/mcc_more_scaffold_cube.png"
                            alt="MCCreations Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="hidden font-brand sm:inline-block text-2xl">
                        MCCreations
                    </span>
                </Link>

                <NavigationMenu className="hidden md:flex">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/feed" legacyBehavior passHref>
                                <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                                    {t("Components.Navbar.feed")}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                {t("Components.Navbar.creations")}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-1 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
                                    {creations.map((creation) => (
                                        <li key={creation.title}>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href={creation.href}
                                                    className="block select-none space-y-2 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                                >
                                                    <div className="text-sm font-medium leading-none">
                                                        {t(`${creation.title}`, {count: 2})}
                                                    </div>
                                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                        {t(creation.description)}
                                                    </p>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    ))}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center ml-auto gap-2">
                    <LanguageSwitcher />
                    <UserOptions />

                    <Button asChild className="hidden md:flex gap-0">
                        <Link href="/create">
                            <Upload className="mr-2 h-4 w-4" />
                            <span>{t("Components.Navbar.create")}</span>
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

const creations = [
    {
        title: "Components.Navbar.Creations.maps",
        description: "Components.Navbar.Creations.maps_blurb",
        href: "/maps",
    },
    {
        title: "Components.Navbar.Creations.datapacks",
        description: "Components.Navbar.Creations.datapacks_blurb",
        href: "/datapacks",
    },
    {
        title: "Components.Navbar.Creations.resourcepacks",
        description: "Components.Navbar.Creations.resourcepacks_blurb",
        href: "/resourcepacks",
    },
];
