import {useEffect} from "react";
import CoverFlow from "../components/cover-flow.tsx";

function Work () {
    useEffect(() => {
        return () => {
            document.body.style.background = "F8FFF6";
        }
    })

    return (
        <div>
            <CoverFlow />
        </div>
)
}

export default Work;