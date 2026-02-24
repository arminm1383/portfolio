import { useEffect } from "react";
import "../styles/home.css";
import HomeButton from "../components/home-button";
import Navbar from "../components/navbar";
import Lenis from 'lenis';


function Home () {

    useEffect(() => {
        return () => {
            document.body.style.backgroundColor = "#F9F9F9";
        }
    }, []);

    useEffect(() => {
        const lenis = new Lenis();
        function raf(time: number){
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        return () => lenis.destroy();
    }, []);

    return (
        <>
            <div className={"navbar-container"}>
                <HomeButton />
                <Navbar />
            </div>
            <div className="hero-container">
                <h1 className={"header-text"}>hi, I'm Armin</h1>
                <p className={"subtext"}>ui/ux designer</p>
            </div>

            <section id="about">

            </section>
        </>
    )
}

export default Home