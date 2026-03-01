
import '../styles/NavbarAlt.css';

function NavbarAlt() {
    return (
        <nav className={"navbar-alt"}>
            <ul>
                <li>
                    <a href={"/#about"} className={"nav-item-alt"}>about</a>
                </li>
                <li>
                    <a href={"/work"} className={"nav-item-alt"}>work</a>
                </li>
            </ul>
        </nav>
    )
}

export default NavbarAlt;