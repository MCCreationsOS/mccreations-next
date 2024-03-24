import Link from "next/link"

export default function MenuSkeleton() {

    return (
        <>
            <div id='login'></div>
            <nav className="nav">
                <div className="main_nav">
                    <ul className="nav_list">
                        <li className="item">
                            <p className="brand">MCCreations <span className="badge red">Beta</span></p>
                        </li>
                        <li className="item">
                            <Link className="link" href="/">Home</Link>
                        </li>
                        <li className="item">
                            <Link className="link" href="/maps">Maps</Link>
                        </li>
                        <li className="item">
                            {/* <a className="navLink" href="/resourcepacks">Resourcepacks</a> */}
                        </li>
                    </ul>
                    <ul className='action_list'>
                        <li className='item'>
                            <Link href='https://mccreations.net/submit' className="nav_button">
                                Create
                            </Link>
                        </li>
                        {/* <li className='navItem'>
                            <Link href='/signup' className="navLink">
                                Log In
                            </Link>
                        </li> */}
                    </ul>
                </div>
                <div className="mobile_nav">
                    <div className="icon_align">
                        <img className="menu_icon" src='/menu.svg' alt="" />
                        <p className="brand">MCCreations <span className="badge red">Alpha</span></p>
                    </div>
                 </div>
            </nav>
        </>
    )
}