import { Menu, Plus, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { OptimizedImage } from "./optimized-image";
export default function Navbar() {
    const t = useTranslations();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between ml-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden">
                            <Menu className="w-5 h-5" />
                            <span className="sr-only">Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-screen max-w-[250px] p-0">
                        <SheetHeader>
                            <SheetTitle className="flex items-center gap-2 mb-8">
                                <Image src="/logo.png" alt="logo" width={32} height={32} />
                                <span className="text-xl font-bold">
                                    <span className="text-foreground">
                                        MCCreations
                                    </span>
                                </span>
                            </SheetTitle>
                        </SheetHeader>
                        <nav className="flex flex-col gap-4">
                            <Link href="/">{t("Terms.home")}</Link>
                            <Link href="/feed">{t("Terms.feed")}</Link>
                            <Link href="/maps">{t("Terms.map", {count: 0})}</Link>
                            <Link href="/datapacks">{t("Terms.datapack", {count: 0})}</Link>
                            <Link href="/resources">{t("Terms.resourcepack", {count: 0})}</Link>
                        </nav>
                    </SheetContent>
                </Sheet>

                <Link href="/" className="flex items-center gap-2 mr-6">
                    <Image src="/logo.png" alt="logo" width={32} height={32} />
                    <span className="text-xl font-bold">
                        <span className="text-foreground">
                            MCCreations
                        </span>
                    </span>
                </Link>

                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <Link href="/feed" legacyBehavior passHref>
                                <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[active]:text-accent-foreground/50">
                                    {t("Terms.feed")}
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                {t("Terms.creation", {count: 0})}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                    <li>
                                        <Link href="/maps" legacyBehavior passHref>
                                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[active]:text-accent-foreground/50">
                                                <div className="text-sm font-medium flex items-center gap-2">
                                                    <OptimizedImage
                                                        src="/maps.png"
                                                        alt="map"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    {t("Terms.map", {count: 0})}
                                                </div>
                                                <p className="text-sm leading-snug text-muted-foreground">
                                                    {t("Navbar.map_description")}
                                                </p>
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/datapacks" legacyBehavior passHref>
                                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[active]:text-accent-foreground/50">
                                                <div className="text-sm font-medium flex items-center gap-2">
                                                    <OptimizedImage
                                                        src="/datapacks.png"
                                                        alt="datapack"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    {t("Terms.datapack", {count: 0})}
                                                </div>
                                                <p className="text-sm leading-snug text-muted-foreground">
                                                    {t("Navbar.datapack_description")}
                                                </p>
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="/resourcepacks" legacyBehavior passHref>
                                            <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[active]:text-accent-foreground/50">
                                                <div className="text-sm font-medium flex items-center gap-2">
                                                    <OptimizedImage
                                                        src="/resourcepacks.png"
                                                        alt="resourcepack"
                                                        width={20}
                                                        height={20}
                                                    />
                                                    {t("Terms.resourcepack", {count: 0})}
                                                </div>
                                                <p className="text-sm leading-snug text-muted-foreground">
                                                    {t("Navbar.resourcepack_description")}
                                                </p>
                                            </NavigationMenuLink>
                                        </Link>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center ml-auto gap-2">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Link href="/login">
                            <User className="w-5 h-5" />
                            {t("Terms.login")}
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Link href="/create">
                            <Plus className="w-5 h-5" />
                            {t("Terms.create")}
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}