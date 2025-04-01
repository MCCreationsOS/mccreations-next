import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "./ui/button";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "./ui/input";
import ThemeSwitch from "./theme-switch";

export default function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-blue-900 text-white">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="MCCreations Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl">MCCreations</span>
            </Link>
            <p className="text-blue-100">{t("Footer.footer_description")}</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-blue-100 hover:text-white hover:bg-blue-800">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-100 hover:text-white hover:bg-blue-800">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-100 hover:text-white hover:bg-blue-800">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-blue-100 hover:text-white hover:bg-blue-800">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("Footer.footer_explore")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/creations" className="text-blue-100 hover:text-white">
                  {t("Terms.creation", {count: 0})}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-blue-100 hover:text-white">
                  {t("Terms.category", {count: 0})}
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-blue-100 hover:text-white">
                  {t("Terms.creator", {count: 0})}
                </Link>
              </li>
              <li>
                <Link href="/creations?sort=newest" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_newest")}
                </Link>
              </li>
              <li>
                <Link href="/creations?sort=popular" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_popular")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("Footer.footer_information")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_contact")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_faq")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-blue-100 hover:text-white">
                  {t("Footer.footer_privacy")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">{t("Footer.footer_newsletter")}</h3>
            <p className="text-blue-100 mb-4">{t("Footer.footer_newsletter_description")}</p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-300"
              />
              <Button className="bg-blue-600 hover:bg-blue-700">{t("Footer.footer_subscribe")}</Button>
            </div>
            <ThemeSwitch />
          </div>
        </div>

        <div className="border-t border-blue-800 mt-12 pt-6 text-center text-blue-200">
          <p>{t("Footer.footer_copyright", {year: new Date().getFullYear()})}</p>
          <p className="text-sm mt-2">
            {t("Footer.footer_disclaimer")}
          </p>
        </div>
      </div>
    </footer>
    )
    
}