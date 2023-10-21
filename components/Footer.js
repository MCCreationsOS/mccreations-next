import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className='footerFlex'>
          <div>
            <h2>MCCreations</h2>
            <p>Create for Community</p>
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
          </div>
          <div>
            <h2>Legal and Contact</h2>
          </div>
        </div>
        © Ben Meier 2023
      </footer>
    </>
  )
}
