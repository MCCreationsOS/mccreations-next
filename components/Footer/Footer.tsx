import { Link } from "@/i18n/navigation";
import styles from './Footer.module.css'
import { getTranslations } from "next-intl/server";
import { Button } from "../ui/button";
import Image from "next/image";

/**
 * The footer
 */
export default async function Footer({params}: {params: Promise<{locale: string}>}) {
    const {locale} = await params;
    const t = await getTranslations({locale: locale})
    const splash = Math.floor(Math.random() * 9) + 1
    return (
        <>
            <footer className="border-t-2 border-white/5">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-5 max-w-6xl mx-auto">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-xl sm:text-2xl font-brand flex flex-row gap-2 items-center"><Image src="/mcc_more_scaffold_cube.png" alt={t('brand')} width={30} height={30} /> {t('brand')}</h2>
                            <p className="text-sm sm:text-base">{t(`Components.Footer.Splashes.${splash}`)}</p>
                            <p className="text-sm sm:text-base">{t.rich('Components.Footer.open_source', {link: (chunks) => <Link href="https://github.com/MCCreationsOS">{chunks}</Link>})}</p>
                            <Link href={'https://blog.mccreations.net'}><Button><span>{t('Components.Footer.updates')}</span></Button></Link>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold mb-2">{t('Components.Footer.join_community')}</h2>
                            <ul className="space-y-1">
                                <li><Link className="hover:underline text-sm sm:text-base" href="https://discord.com/invite/HQSnKGf">{t('Components.Footer.discord')}</Link></li>
                                <li><Link className="hover:underline text-sm sm:text-base" href="https://twitter.com/_MCCreations">{t('Components.Footer.twitter')}</Link></li>
                                <li><Link className="hover:underline text-sm sm:text-base" href="https://bsky.app/profile/mccreations.bsky.social">{t('Components.Footer.bluesky')}</Link></li>
                                <li><Link className="hover:underline text-sm sm:text-base" href="https://www.youtube.com/@MCCreationsSite">{t('Components.Footer.youtube')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold mb-2">{t('Components.Footer.legal_contact')}</h2>
                            <ul className="space-y-1">
                                <li><Link className="hover:underline text-sm sm:text-base" href="/privacy_policy">{t('Components.Footer.privacy')}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center text-[10px] sm:text-xs p-4 text-center'>
                        <p className="max-w-[90%] sm:max-w-full">{t('Components.Footer.mojang_disclamer')}</p>
                        <p>{t('Components.Footer.copyright')} {new Date(Date.now()).getFullYear()}</p>
                    </div>
            </footer>
        </>
    )
}
