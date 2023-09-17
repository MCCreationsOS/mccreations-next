export default function MenuSkeleton() {

    return (
        <>
            <div id='login'></div>
            <nav className="mainNav">
                <ul className="navList">
                    <li className="navItem">
                        <p className="navBrand">MCCreations</p>
                    </li>
                    <li className="navItem">
                        <a className="navLink" href="/">Home</a>
                    </li>
                    <li className="navItem">
                        <a className="navLink" href="/maps">Maps</a>
                    </li>
    <li className="navItem">
                        <a className="navLink" href="/resourcepacks">Resourcepacks</a>
                    </li>
                </ul>
                <ul className='actionList'>
                    <li className='navItem'>
                        <button className='navButton'>Submit</button>
                    </li>
                </ul>
            </nav>
        </>
    )
}