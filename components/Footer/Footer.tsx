import Link from 'next/link'
import styles from './Footer.module.css'
import MainButton from '../Buttons/MainButton'
import { getI18n, getStaticParams } from '@/locales/server'

export function generateStaticParams() {
    return getStaticParams()
}

/**
 * The footer
 */
export default async function Footer() {
    const t = await getI18n()
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.flex}>
                    <div>
                        <h2><img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>{t('brand')}</h2>
                        <p>{t('footer.splash')}</p>
                        <p>{t('footer.open_source1')}<Link href="https://github.com/MCCreationsOS">{t('footer.open_source2')}</Link>{t('footer.open_source3')}</p>
                        <Link href={'https://blog.mccreations.net'}><MainButton>{t('footer.updates')}</MainButton></Link>
                    </div>
                    <div>
                        <h2>{t('footer.join_community')}</h2>
                        <ul>
                            <li><Link href="https://discord.com/invite/HQSnKGf">{t('footer.discord')}</Link></li>
                            <li><Link href="https://twitter.com/_MCCreations">{t('footer.twitter')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2>{t('footer.about_support')}</h2>
                        <ul>
                            <li><Link href="https://www.mccreations.net/about">{t('footer.about')}</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2>{t('footer.legal_contact')}</h2>
                        <ul>
                            <li><Link href="https://www.mccreations.net/request-data">{t('footer.request_data')}</Link></li>
                            <li><Link href="https://www.mccreations.net/privacy">{t('footer.privacy')}</Link></li>
                            <li><Link href="https://www.mccreations.net/contact">{t('footer.contact')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className='centered_content small center_text footer_margin'>
                    {t('footer.mojang_disclamer1')} <br></br>
                    {t('footer.mojang_disclamer2')}
                </div>
                <div className='centered_content small center_text footer_margin'>
                    {t('footer.copyright')} {new Date(Date.now()).getFullYear()}
                </div>
            </footer>
        </>
    )
}
