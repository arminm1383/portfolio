// ─────────────────────────────────────────────────────────────────────────────
// arminLM knowledge base — why each hero-collage graphic matters to Armin.
//
// FILL THESE IN. Each entry's `context` is the ONLY source of truth arminLM gets
// about that graphic. The richer and more specific the context, the better the
// answers. Keep it factual and personal — the model is told NOT to invent details
// beyond what's written here, so anything you leave as a placeholder will produce
// a vague (but honest) answer.
//
// `label` is the human-friendly name shown to the model and used in the prompt.
// `id` must match the photo's `id` on the About and Art pages (the `Photo` objects in About.tsx / Art.tsx) or, for the
// archived landing collage, its `data-graphic` id.
// ─────────────────────────────────────────────────────────────────────────────

export interface GraphicInfo {
  label: string
  context: string
}

export const GRAPHIC_CONTEXT: Record<string, GraphicInfo> = {
  // ── About page photos ──
  'about-anteater': {
    label: 'Me + Peter the Anteater (06.2026)',
    context: 'A photo of Armin with Peter the Anteater, the UC Irvine mascot statue, taken 06.2026. Armin studies computer science and business at UCI. FILL IN what UCI / this moment means to him.',
  },
  'about-filet': {
    label: 'Reimagining the Filet-O-Fish (06.2026)',
    context: 'A photo captioned "reimagining the filet-o-fish" from 06.2026, a playful design take on the McDonald\'s sandwich. FILL IN the story: a project, a challenge, a food obsession?',
  },
  'about-lucas': {
    label: 'The Lucas Museum (09.2026)',
    context: 'A photo of the Lucas Museum, 09.2026. Armin is a storyteller who loves art and museums as inspiration for his design. FILL IN what he took from the visit.',
  },
  'about-yosemite': {
    label: 'Bouldering in Yosemite (09.2026)',
    context: 'Armin bouldering in Yosemite, 09.2026. FILL IN how climbing and the outdoors shape how he approaches hard problems.',
  },
  'about-huntington': {
    label: 'The Huntington Library (05.2026)',
    context: 'A photo at the Huntington Library, 05.2026. FILL IN why he loves places like this (gardens, collections, slow looking).',
  },
  'about-japan': {
    label: 'Jumping in Japan (01.2025)',
    context: 'Armin jumping in Japan, 01.2025. FILL IN the trip: where, why, what it meant to him.',
  },
  'about-designathon': {
    label: 'Reaching the Design-a-thon finals (04.2026)',
    context: 'Armin reaching the finals of a design-a-thon, 04.2026. He designs in Figma and ships in React, and has won a case competition (Findy). FILL IN the details of the event.',
  },
  'about-fruit': {
    label: 'Fruit in the middle of nowhere (10.2025)',
    context: 'A photo of fruit found in the middle of nowhere, 10.2025. FILL IN the story behind it.',
  },
  'about-monet': {
    label: 'Monet at the Getty (09.2025)',
    context: 'Armin looking at a Monet at the Getty, 09.2025. He says every piece of art inspires his creativity. FILL IN which painting and why it stuck.',
  },

  // ── Art as of late ──
  'art-no-other-choice': {
    label: 'No Other Choice (film)',
    context: 'A film Armin watched recently, shown on his "art as of late" page. FILL IN what he loved about it (the story, the cinematography, how it feels).',
  },
  'art-on-guitar': {
    label: 'On Guitar (album)',
    context: 'An album called "on guitar" on his "art as of late" page. FILL IN why it resonates (and whether he plays guitar).',
  },
  'art-strawberry-fennel': {
    label: 'Strawberry + Fennel (food)',
    context: 'A strawberry and fennel dish on his "art as of late" page; Armin counts the food he eats as art. FILL IN where he had it and what made it memorable.',
  },
  'art-monet': {
    label: 'Monet (museum)',
    context: 'A Monet painting seen at a museum, on his "art as of late" page. FILL IN which painting and what it did for him.',
  },

  'wii': {
    label: 'Wii Remote',
    // e.g. "Growing up, Wii Sports with his family was Armin's first taste of
    //       playful, intuitive interaction design — a big reason he cares about
    //       interfaces that feel effortless."
    context: 'FILL ME — why is there a Wii remote in the collage? What does gaming / the Wii mean to Armin?',
  },
  'koi': {
    label: 'Koi Fish',
    // e.g. "The koi nods to Armin's Persian-Japanese design sensibilities and the
    //       idea of swimming upstream — persistence through hard problems."
    context: 'FILL ME — what does the koi fish represent for Armin? (culture, symbolism, personal meaning?)',
  },
  'yosemite': {
    label: 'Yosemite',
    context: 'FILL ME — the Yosemite / national-park photo. Does Armin hike? A specific trip or memory?',
  },
  'ipod': {
    label: 'iPod',
    // e.g. "Music is Armin's constant companion while designing; the click-wheel
    //       iPod is peak nostalgic hardware design he still admires."
    context: 'FILL ME — what does the iPod say about Armin? (music taste, love of Apple industrial design, nostalgia?)',
  },
  'mac': {
    label: 'Vintage Macintosh',
    context: 'FILL ME — the old Macintosh. Armin\'s relationship to Apple, to computing history, to design tools?',
  },
  'boy': {
    label: 'Young Armin with a Guitar',
    context: 'FILL ME — young Armin holding a guitar. Does he play? What does music/creativity mean to him?',
  },
  'me-green': {
    label: 'Armin (illustrated self-portrait)',
    context: 'FILL ME — the green illustrated figure is Armin himself. A line or two on who he is / his vibe.',
  },
  'bird1': {
    label: 'Bird',
    context: 'FILL ME (optional) — the birds are partly decorative; add meaning if there is any, otherwise keep it light.',
  },
  'bird3': {
    label: 'Bird',
    context: 'FILL ME (optional) — the birds are partly decorative; add meaning if there is any, otherwise keep it light.',
  },
  'icon-figma': {
    label: 'Figma',
    context: 'Figma is Armin\'s primary design tool — his portfolio is designed in Figma and implemented in code (Figma → code is his core workflow). FILL IN anything more specific.',
  },
  'icon-react': {
    label: 'React',
    context: 'React (+ TypeScript) is how Armin ships his designs as real, interactive products — he\'s a design engineer who builds what he designs. FILL IN anything more specific.',
  },
  'icon-claude': {
    label: 'Claude',
    context: 'Claude is part of Armin\'s workflow — he builds with AI, including this very arminLM assistant. FILL IN anything more specific.',
  },
}
