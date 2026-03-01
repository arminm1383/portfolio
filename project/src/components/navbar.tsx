
import '../styles/Navbar.css';

function Navbar() {

    return (
        <nav className={"navbar"}>
            <ul>
                <li>
                    <a href={"#about"} className={"nav-item"}>about</a>
                </li>
                <li>
                    <a href={"/work"} className={"nav-item"}>work</a>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar;