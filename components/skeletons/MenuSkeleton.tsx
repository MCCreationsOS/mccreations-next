import Link from "next/link"
import Badge from "../Badge"
import HollowButton from "../Buttons/HollowButton"

export default function MenuSkeleton() {

    return (
        <>
            <div id='login'></div>
            <nav className="nav">
                <div className="main_nav">
                    <ul className="nav_list">
                        <li className="item">
                            <p className="brand">MCCreations <Badge color="red">Beta</Badge></p>
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
                            <HollowButton>Create</HollowButton>
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
                        <p className="brand">MCCreations <Badge color="red">Beta</Badge></p>
                    </div>
                 </div>
            </nav>
        </>
    )
}