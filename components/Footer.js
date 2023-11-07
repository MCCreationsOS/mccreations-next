import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className='footer_flex'>
          <div>
            <h2>MCCreations</h2>
            <p>Wonderfully generic slogan here</p>
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
        © Ben Meier/CrazyCowMM {new Date(Date.now()).getFullYear()}
      </footer>
    </>
  )
}
