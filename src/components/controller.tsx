
import '../styles/Controller.css';
import playback from '../assets/playback.png';
import rewind from '../assets/rewind.png';
import fast_forward from '../assets/fast_forward.png';

function Controller( {onNext, onPrevious, onPlay}) {
    return (
        <nav className={"controller"}>
            <ul>
                <li>
                    <button onClick={onPrevious}>
                        <img src={rewind} alt="rewind" className="controller-item"/>
                    </button>
                </li>
                <li>
                    <button onClick={onPlay}>
                        <img src={playback} alt="playback" className="controller-item"/>
                    </button>
                </li>
                <li>
                    <button onClick={onNext}>
                        <img src={fast_forward} alt="fast-forward" className="controller-item" />
                    </button>
                </li>
            </ul>
        </nav>
    )
}

export default Controller