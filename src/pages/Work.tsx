import {useEffect} from "react";
// import CoverFlow from "../components/cover-flow.tsx";
import Navbar from "../components/navbar.tsx";
import HomeButton from "../components/home-button.tsx";

function Work () {
    useEffect(() => {
        return () => {
            document.body.style.background = "F8FFF6";
        }
    })

    return (
        <div>
            <div className={"navbar-container"}>
                <HomeButton />
                <Navbar />
            </div>
            {/*<CoverFlow />*/}
        </div>
    )
}

export default Work;