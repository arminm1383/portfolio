
import { motion } from "motion/react"
import "../styles/RecordPlayer.css";
import vinyl from "../assets/vinyl.png";
import vinylNeedle from "../assets/vinyl_needle.png";
import vinylStand from "../assets/vinyl_stand.png";

function RecordPlayer() {
    return (
        <div className={"wrapper"}>
            <div className = "record-player-container">
                <img src = {vinylStand} className = {"vinyl-stand"} />
                <motion.img
                    src = {vinyl}
                    className = "vinyl"
                    style={{ translateX: "-60%", translateY: "-48%" }}
                    animate = {{ rotate: [0, 360] }}
                    transition = {{
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "linear",
                        duration: 3
                    }}/>
                <img src = {vinylNeedle}  className = {"vinyl-needle"}/>
            </div>
        </div>
    )
}

export default RecordPlayer;