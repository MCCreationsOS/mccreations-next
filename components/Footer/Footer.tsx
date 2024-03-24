import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.flex}>
                    <div>
                        <h2><img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>MCCreations</h2>
                        <p>Submission is the best admission</p>
                        <p>MCCreations is <Link href="https://github.com/BenMeie/mccreations-next">open source</Link>. Contribute today!</p>
                    </div>
                    <div>
                        <h2>Join the Community</h2>
                        <ul>
                            <li><Link href="https://discord.com/invite/HQSnKGf">Discord</Link></li>
                            <li><Link href="https://twitter.com/_MCCreations">Twitter</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2>About And Support</h2>
                        <ul>
                            <li><Link href="https://www.mccreations.net/about">About</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2>Legal and Contact</h2>
                        <ul>
                            <li><Link href="https://www.mccreations.net/request-data">Request Data</Link></li>
                            <li><Link href="https://www.mccreations.net/privacy">Privacy Policy</Link></li>
                            <li><Link href="https://www.mccreations.net/contact">Contact</Link></li>
                        </ul>
                    </div>
                </div>
                <div className='centered_content small center_text footer_margin'>
                    NOT AN OFFICIAL MINECRAFT PRODUCT. <br></br>
                    NOT APPROVED BY OR ASSOCIATED WITH MOJANG.
                </div>
                <div className='centered_content small center_text footer_margin'>
                    © Ben Meier/CrazyCowMM {new Date(Date.now()).getFullYear()}
                </div>
            </footer>
        </>
    )
}
