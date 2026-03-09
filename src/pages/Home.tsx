import { useEffect, useRef } from "react";
import "../styles/Home.css";
import HomeButton from "../components/home-button.tsx";
import Navbar from "../components/navbar.tsx";
import Lenis from 'lenis';
import triangleIcon from "../assets/icon.png";
import RecordPlayer from "../components/RecordPlayer";

function Home () {

    useEffect(() => {
        document.body.style.backgroundColor = "#F9F9F9";
    }, []);

    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        lenisRef.current = new Lenis();
        function raf(time: any) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }, []);

    return (
        <>
            <div className={"navbar-container"}>
                <HomeButton />
                <Navbar />
            </div>
            <div className={"hero-container"}>
                <div className="hero-text-container">
                    <h1 className={"header-text"}>hi, I'm Armin</h1>
                    <p className={"subtext"}>ui/ux designer</p>
                </div>
                <div className={"hero-record-container"}>
                    <RecordPlayer />
                    <button
                        className={"view-more-button"}
                        onClick={() => {
                            lenisRef.current?.scrollTo('#featured-work')}}>
                        <h1 className={"view-more-button-text"}>view more</h1>
                        <img
                            className={"triangle-icon"}
                            src={triangleIcon}
                        />
                    </button>
                </div>
            </div>
            <section id="featured-work">
                <h1 className={"featured-work-text"}>featured work</h1>
                <div className={"work-grid"}>

                </div>
            </section>
        </>
    )
}

export default Home