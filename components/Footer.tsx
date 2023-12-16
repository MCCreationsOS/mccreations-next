import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className='footer_flex'>
          <div>
            <h2><img className="brand_icon" src="/mcc_more_scaffold_cube.png"></img>MCCreations</h2>
            <p>Now with accounts!</p>
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
        © Ben Meier/CrazyCowMM {new Date(Date.now()).getFullYear()} NOT AN OFFICIAL MINECRAFT PRODUCT. NOT APPROVED BY OR ASSOCIATED WITH MOJANG.
      </footer>
    </>
  )
}
