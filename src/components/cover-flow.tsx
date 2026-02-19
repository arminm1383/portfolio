
import { useState } from 'react';
import Controller from './controller.tsx'
import '../styles/cover-flow.css';
import apolloImg from '../assets/apollo.png';
import aviImg from '../assets/avi.png';
import beatabilityImg from '../assets/beatability.png';
import cashewImg from '../assets/cashew.png';
import fabflixImg from '../assets/fabflix.png';
import sidequestImg from '../assets/sidequest_album.png';
import ubaImg from '../assets/uba.png';

interface Album {
    name: string;
    image: string;
    description: string;
    alt: string;
}

function CoverFlow() {

    const [index, setIndex] = useState(0);
    const albumArray: Album[] = [
        {name: "SideQuest", image: sidequestImg, description: "lorem ipsum", alt: "Artwork for SideQuest"},
        {name: "UBA", image: ubaImg, description: "lorem ipsum", alt: "Artwork for UBA"},
        {name: "Cashew", image: cashewImg, description: "lorem ipsum", alt: "Artwork for Cashew"},
        {name: "Fabflix", image: fabflixImg, description: "lorem ipsum", alt: "Artwork for Fabflix"},
        {name: "Apollo", image: apolloImg, description: "lorem ipsum", alt: "Artwork for Apollo"},
        {name: "Avi", image: aviImg, description: "lorem ipsum", alt: "Artwork for Avi"},
        {name: "Beatbility", image: beatabilityImg, description: "lorem ipsum", alt: "Artwork for Beatbility"},
    ]

    function handleNext(){
        setIndex((index + 1) % albumArray.length);
    }

    function handlePrevious() {
        setIndex((index - 1 + albumArray.length) % albumArray.length);
    }

    function handlePlay() {

    }

    return (
        <div className="coverFlow">
            <Controller onNext={handleNext} onPrevious={handlePrevious} onPlay={handlePlay}/>
            <div className="album">
                <img src={albumArray[(index - 2 + albumArray.length) % albumArray.length].image}
                     alt={albumArray[(index - 2 + albumArray.length) % albumArray.length].alt} />
            </div>
            <div className="album">
                <img src={albumArray[(index - 1 + albumArray.length) % albumArray.length].image}
                     alt={albumArray[(index - 1 + albumArray.length) % albumArray.length].alt} />
            </div>
            <div className="albumCurrent">
                <img src={albumArray[index].image}
                     alt={albumArray[index].alt} />
                <h1 className="albumTitle">{albumArray[index].name}</h1>
                <p className="albumDescription">{albumArray[index].description}</p>
            </div>
            <div className="album">
                <img src={albumArray[(index + 1) % albumArray.length].image}
                     alt={albumArray[(index + 1) % albumArray.length].alt} />
            </div>
            <div className="album">
                <img src={albumArray[(index + 2) % albumArray.length].image}
                     alt={albumArray[(index + 2) % albumArray.length].alt} />
            </div>
        </div>
    )
}

export default CoverFlow;