import { Link } from "@/app/api/navigation";
import styles from './Footer.module.css'
import MainButton from '../Buttons/MainButton'
import { getTranslations } from "next-intl/server";

/**
 * The footer
 */
export default async function Footer() {
    const t = await getTranslations()
    const splash = Math.floor(Math.random() * 9) + 1
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.flex}>
                    <div>
                        <h2><img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>{t('brand')}</h2>
                        <p>{t(`Footer.Splashes.${splash}`)}</p>
                        <p>{t.rich('Footer.open_source', {link: (chunks) => <Link href="https://github.com/MCCreationsOS">{chunks}</Link>})}</p>
                        <Link href={'https://blog.mccreations.net'}><MainButton>{t('Footer.updates')}</MainButton></Link>
                    </div>
                    <div>
                        <h2>{t('Footer.join_community')}</h2>
                        <ul>
                            <li><Link href="https://discord.com/invite/HQSnKGf">{t('Footer.discord')}</Link></li>
                            <li><Link href="https://twitter.com/_MCCreations">{t('Footer.twitter')}</Link></li>
                            <li><Link href="https://bsky.app/profile/mccreations.bsky.social">{t('Footer.bluesky')}</Link></li>
                            <li><Link href="https://www.youtube.com/@MCCreationsSite">{t('Footer.youtube')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2>{t('Footer.legal_contact')}</h2>
                        <ul>
                            <li><Link href="/privacy_policy">{t('Footer.privacy')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className='centered_content small center_text footer_margin'>
                    {t('Footer.mojang_disclamer')}
                </div>
                <div className='centered_content small center_text footer_margin'>
                    {t('Footer.copyright')} {new Date(Date.now()).getFullYear()}
                </div>
            </footer>
        </>
    )
}
