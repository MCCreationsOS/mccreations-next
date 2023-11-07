export default function MenuSkeleton() {

    return (
        <>
            <div id='login'></div>
            <nav className="nav">
                <ul className="nav_list">
                    <li className="item">
                        <p className="brand">MCCreations</p>
                    </li>
                    <li className="item">
                        <a className="link" href="/">Home</a>
                    </li>
                    <li className="item">
                        <a className="link" href="/maps">Maps</a>
                    </li>
                    <li className="item">
                        {/* <a className="navLink" href="/resourcepacks">Resourcepacks</a> */}
                    </li>
                </ul>
                <ul className='action_list'>
                    <li className='item'>
                        <a href='https://mccreations.net/submit' className="nav_button">
                            Create
                        </a>
                    </li>
                    {/* <li className='navItem'>
                        <Link href='/signup' className="navLink">
                            Log In
                        </Link>
                    </li> */}
                </ul>
            </nav>
        </>
    )
}