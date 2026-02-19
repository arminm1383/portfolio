import {useEffect} from "react";
import NavbarAlt from "../components/navbar-alt.tsx";
import HomeButtonAlt from "../components/home-button-alt.tsx";
import CoverFlow from "../components/cover-flow.tsx";

function Work () {
    useEffect(() => {
        return () => {
            document.body.style.background = "F8FFF6";
        }
    })

    return (
        <div>
            <div className={"navbar-alt-container"}>
                <HomeButtonAlt />
                <NavbarAlt />
            </div>
            <CoverFlow />
        </div>
)
}

export default Work;