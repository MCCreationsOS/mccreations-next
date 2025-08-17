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

                    <div className="flex flex-row gap-10 justify-center p-5">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-brand flex flex-row gap-2 items-center"><Image src="/mcc_more_scaffold_cube.png" alt={t('brand')} width={30} height={30} /> {t('brand')}</h2>
                            <p>{t(`Components.Footer.Splashes.${splash}`)}</p>
                            <p>{t.rich('Components.Footer.open_source', {link: (chunks) => <Link href="https://github.com/MCCreationsOS">{chunks}</Link>})}</p>
                            <Link href={'https://blog.mccreations.net'}><Button><span>{t('Components.Footer.updates')}</span></Button></Link>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{t('Components.Footer.join_community')}</h2>
                            <ul>
                                <li><Link className="hover:underline" href="https://discord.com/invite/HQSnKGf">{t('Components.Footer.discord')}</Link></li>
                                <li><Link className="hover:underline" href="https://twitter.com/_MCCreations">{t('Components.Footer.twitter')}</Link></li>
                                <li><Link className="hover:underline" href="https://bsky.app/profile/mccreations.bsky.social">{t('Components.Footer.bluesky')}</Link></li>
                                <li><Link className="hover:underline" href="https://www.youtube.com/@MCCreationsSite">{t('Components.Footer.youtube')}</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{t('Components.Footer.legal_contact')}</h2>
                            <ul>
                                <li><Link className="hover:underline" href="/privacy_policy">{t('Components.Footer.privacy')}</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 items-center justify-center text-xs'>
                        <p>{t('Components.Footer.mojang_disclamer')}</p>
                        <p>{t('Components.Footer.copyright')} {new Date(Date.now()).getFullYear()}</p>
                    </div>
            </footer>
        </>
    )
}
