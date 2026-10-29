// The landing's work clips (pixel cut + real clip per project), shared with the Up Next cards on every case study
import { type LoopVideoSource } from '../components/LoopVideo'
// Streets, Memento and Rocket play as video (their GIFs stay in the repo, unused): 5-26x smaller, no dithering
import streetsMp4     from '../assets/images/streets-work.mp4'
import streetsWebm    from '../assets/images/streets-work.webm'
import streetsPoster  from '../assets/images/streets-work-poster.jpg'
// Pixel-art cut of the Streets clip (same length and frame rate), shown until the card is hovered
import streetsPixelMp4    from '../assets/images/streets-work-pixel.mp4'
import streetsPixelWebm   from '../assets/images/streets-work-pixel.webm'
import streetsPixelPoster from '../assets/images/streets-work-pixel-poster.jpg'
import mementoMp4     from '../assets/images/memento-work.mp4'
import mementoWebm    from '../assets/images/memento-work.webm'
import mementoPoster  from '../assets/images/memento-work-poster.jpg'
// Pixel-art cut of the Memento clip (same length and frame rate), shown until the card is hovered
import mementoPixelMp4    from '../assets/images/memento-work-pixel-v3.mp4'
import mementoPixelWebm   from '../assets/images/memento-work-pixel.webm'
import mementoPixelPoster from '../assets/images/memento-work-pixel-poster.jpg'
import rocketMp4      from '../assets/images/rocket-work-sparkle.mp4'
import rocketWebm     from '../assets/images/rocket-work-sparkle.webm'
import rocketPoster   from '../assets/images/rocket-work-sparkle-poster.jpg'
// Pixel-art cut of the Rocket clip (same length and frame rate), shown until the card is hovered
import rocketPixelMp4    from '../assets/images/rocket-work-sparkle-pixel.mp4'
import rocketPixelWebm   from '../assets/images/rocket-work-sparkle-pixel.webm'
import rocketPixelPoster from '../assets/images/rocket-work-sparkle-pixel-poster.jpg'
// Findy's phone clips have the card's #fafdff fill baked in (the card is a fixed colour, so no transparency is needed)
import findyMp4          from '../assets/images/findy-work-phone.mp4'
import findyWebm         from '../assets/images/findy-work-phone.webm'
import findyPoster       from '../assets/images/findy-work-phone-poster.jpg'
import findyPixelMp4     from '../assets/images/findy-work-phone-pixel.mp4'
import findyPixelWebm    from '../assets/images/findy-work-phone-pixel.webm'
import findyPixelPoster  from '../assets/images/findy-work-phone-pixel-poster.jpg'

export const STREETS_VIDEO: LoopVideoSource = { webm: streetsWebm, mp4: streetsMp4, poster: streetsPoster }
export const STREETS_PIXEL_VIDEO: LoopVideoSource = { webm: streetsPixelWebm, mp4: streetsPixelMp4, poster: streetsPixelPoster }
export const MEMENTO_VIDEO: LoopVideoSource = { webm: mementoWebm, mp4: mementoMp4, poster: mementoPoster }
export const MEMENTO_PIXEL_VIDEO: LoopVideoSource = { webm: mementoPixelWebm, mp4: mementoPixelMp4, poster: mementoPixelPoster }
export const ROCKET_VIDEO: LoopVideoSource = { webm: rocketWebm, mp4: rocketMp4, poster: rocketPoster }
export const ROCKET_PIXEL_VIDEO: LoopVideoSource = { webm: rocketPixelWebm, mp4: rocketPixelMp4, poster: rocketPixelPoster }
export const FINDY_VIDEO: LoopVideoSource = { webm: findyWebm, mp4: findyMp4, poster: findyPoster }
export const FINDY_PIXEL_VIDEO: LoopVideoSource = { webm: findyPixelWebm, mp4: findyPixelMp4, poster: findyPixelPoster }


export const ALL_WORK_POSTERS = [
  streetsPixelPoster, rocketPixelPoster, mementoPixelPoster, findyPixelPoster,
  streetsPoster, mementoPoster, rocketPoster, findyPoster,
]
