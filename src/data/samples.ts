import { StyleSample, ContentSample } from '../types';

// A helper to generate crisp, beautifully patterned SVG Data URLs representing artistic scenes
const createSvgDataUrl = (svgContent: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
};

export const STYLE_SAMPLES: StyleSample[] = [
  {
    id: 'starry-night',
    name: 'Starry Night Swirls',
    artist: 'Vincent van Gogh',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <radialGradient id="star" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FFFDD0" />
            <stop offset="40%" stop-color="#FFDF00" />
            <stop offset="100%" stop-color="#0f2042" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="sky" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0B132B" />
            <stop offset="50%" stop-color="#1C2541" />
            <stop offset="100%" stop-color="#3A506B" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#sky)" />
        <!-- Swirling wind paths -->
        <path d="M 0 150 Q 100 100 200 160 T 400 120" fill="none" stroke="#48CAE4" stroke-width="8" stroke-linecap="round" opacity="0.6" stroke-dasharray="10 5" />
        <path d="M 0 170 Q 120 220 250 150 T 400 180" fill="none" stroke="#FFD166" stroke-width="5" stroke-linecap="round" opacity="0.7" stroke-dasharray="8 6" />
        <path d="M 50 120 Q 150 70 300 130" fill="none" stroke="#90E0EF" stroke-width="6" stroke-linecap="round" opacity="0.5" />
        <!-- Swirling stars -->
        <circle cx="80" cy="70" r="30" fill="url(#star)" />
        <circle cx="80" cy="70" r="4" fill="#FFF" />
        <circle cx="280" cy="80" r="40" fill="url(#star)" />
        <circle cx="280" cy="80" r="6" fill="#FFF" />
        <circle cx="180" cy="110" r="25" fill="url(#star)" opacity="0.8" />
        <circle cx="180" cy="110" r="3" fill="#FFF" />
        <circle cx="340" cy="160" r="35" fill="url(#star)" />
        <circle cx="340" cy="160" r="5" fill="#FFF" />
        <!-- Heavy brush strokes silhouettes -->
        <path d="M 0 300 C 50 250, 100 280, 150 300 L 400 300 L 400 240 C 350 250, 300 230, 250 270 C 200 290, 120 220, 0 300 Z" fill="#03071E" opacity="0.9" />
        <!-- Crescent yellow moon -->
        <path d="M 330 40 A 25 25 0 1 0 370 80 A 30 30 0 1 1 330 40 Z" fill="#FFD166" />
      </svg>
    `),
    description: 'Post-impressionist swirling brushstrokes with deep blues and glowing yellow stars.'
  },
  {
    id: 'the-scream',
    name: 'Scream Waves',
    artist: 'Edvard Munch',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="sunset" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#F25C54" />
            <stop offset="30%" stop-color="#F27A7D" />
            <stop offset="60%" stop-color="#F7B267" />
            <stop offset="100%" stop-color="#F7D08A" />
          </linearGradient>
          <linearGradient id="fiord" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1D2D44" />
            <stop offset="100%" stop-color="#0D1B2A" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#sunset)" />
        <!-- Screaming landscape waves -->
        <path d="M 0 120 Q 100 160 200 120 T 400 140 L 400 300 L 0 300 Z" fill="url(#fiord)" />
        <!-- Orange/red heavy sky wave curves -->
        <path d="M 0 30 Q 150 90, 300 30 T 400 40" fill="none" stroke="#D62828" stroke-width="12" stroke-linecap="round" opacity="0.6" />
        <path d="M 0 60 Q 100 120, 250 70 T 400 90" fill="none" stroke="#F77F00" stroke-width="10" stroke-linecap="round" opacity="0.7" />
        <!-- Diagonal railing bridge -->
        <path d="M 0 220 L 250 300" stroke="#7F5539" stroke-width="20" stroke-linecap="round" />
        <path d="M 0 210 L 250 290" stroke="#B1A7A6" stroke-width="3" />
        <path d="M 0 230 L 250 310" stroke="#7F5539" stroke-width="4" />
        <!-- Eerie blue waves -->
        <path d="M 120 180 Q 200 220 300 170" fill="none" stroke="#3A86C8" stroke-width="6" stroke-linecap="round" opacity="0.5" />
      </svg>
    `),
    description: 'Anxious, flowing warm crimson sky and cool deep blue landscape bands.'
  },
  {
    id: 'cyberpunk-neon',
    name: 'Synthwave Neon Grid',
    artist: 'Digital Retro',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <defs>
          <linearGradient id="neonBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#050510" />
            <stop offset="60%" stop-color="#15002a" />
            <stop offset="100%" stop-color="#350050" />
          </linearGradient>
          <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFE121" />
            <stop offset="50%" stop-color="#FF007F" />
            <stop offset="100%" stop-color="#7F00FF" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#neonBg)" />
        <!-- Retro Synth Sun -->
        <circle cx="200" cy="140" r="50" fill="url(#sunGrad)" />
        <!-- Horizon lines inside the sun -->
        <rect x="140" y="115" width="120" height="4" fill="#050510" />
        <rect x="140" y="130" width="120" height="6" fill="#050510" />
        <rect x="140" y="150" width="120" height="8" fill="#050510" />
        <rect x="140" y="172" width="120" height="12" fill="#050510" />
        <!-- Retro Perspective Grid -->
        <path d="M 200 180 L 0 300 M 200 180 L 50 300 M 200 180 L 100 300 M 200 180 L 150 300 M 200 180 L 200 300 M 200 180 L 250 300 M 200 180 L 300 300 M 200 180 L 350 300 M 200 180 L 400 300" stroke="#FF007F" stroke-width="1.5" opacity="0.8" />
        <!-- Horizontal grid lines -->
        <line x1="0" y1="190" x2="400" y2="190" stroke="#FF007F" stroke-width="1.2" opacity="0.3" />
        <line x1="0" y1="205" x2="400" y2="205" stroke="#FF007F" stroke-width="1.2" opacity="0.4" />
        <line x1="0" y1="225" x2="400" y2="225" stroke="#FF007F" stroke-width="1.5" opacity="0.6" />
        <line x1="0" y1="250" x2="400" y2="250" stroke="#FF007F" stroke-width="2.0" opacity="0.8" />
        <line x1="0" y1="285" x2="400" y2="285" stroke="#39FF14" stroke-width="2.5" opacity="0.9" />
        <!-- Glowing neon grid accents -->
        <circle cx="200" cy="140" r="54" fill="none" stroke="#FF007F" stroke-width="2" opacity="0.2" />
      </svg>
    `),
    description: 'Vibrant neon synthwave sunset, perspective grids, magenta curves, and techno glows.'
  },
  {
    id: 'mosaic-cubism',
    name: 'Art Deco Mosaic',
    artist: 'Pablo K.',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
        <!-- Colored polygonal mosaic tiles -->
        <polygon points="0,0 120,0 80,90 0,60" fill="#E63946" stroke="#1D3557" stroke-width="4" />
        <polygon points="120,0 250,0 200,110 80,90" fill="#F4A261" stroke="#1D3557" stroke-width="4" />
        <polygon points="250,0 400,0 400,120 280,140 200,110" fill="#2A9D8F" stroke="#1D3557" stroke-width="4" />
        <polygon points="0,60 80,90 60,180 0,160" fill="#E9C46A" stroke="#1D3557" stroke-width="4" />
        <polygon points="80,90 200,110 160,200 60,180" fill="#264653" stroke="#1D3557" stroke-width="4" />
        <polygon points="200,110 280,140 320,230 160,200" fill="#E76F51" stroke="#1D3557" stroke-width="4" />
        <polygon points="280,140 400,120 400,240 320,230" fill="#A8DADC" stroke="#1D3557" stroke-width="4" />
        <polygon points="0,160 60,180 40,300 0,300" fill="#457B9D" stroke="#1D3557" stroke-width="4" />
        <polygon points="60,180 160,200 120,300 40,300" fill="#2A9D8F" stroke="#1D3557" stroke-width="4" />
        <polygon points="160,200 320,230 280,300 120,300" fill="#F4A261" stroke="#1D3557" stroke-width="4" />
        <polygon points="320,230 400,240 400,300 280,300" fill="#E63946" stroke="#1D3557" stroke-width="4" />
      </svg>
    `),
    description: 'Shattered cubist geometric patterns with high-contrast pastel and dark contours.'
  }
];

export const CONTENT_SAMPLES: ContentSample[] = [
  {
    id: 'mountain',
    name: 'Alpine Mountain Peak',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
        <defs>
          <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#A1C4FD" />
            <stop offset="100%" stop-color="#C2E9FB" />
          </linearGradient>
          <linearGradient id="mntGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stop-color="#8E9AAF" />
            <stop offset="100%" stop-color="#2F3E46" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#skyGrad)" />
        <!-- Sun -->
        <circle cx="360" cy="110" r="35" fill="#FFF" opacity="0.9" />
        <!-- Low distant hills -->
        <path d="M0 350 L0 260 Q120 230 240 280 T500 250 L500 350 Z" fill="#52796F" opacity="0.7" />
        <!-- Back mountain -->
        <polygon points="80,350 250,110 380,350" fill="#4A5759" opacity="0.85" />
        <!-- Main front heavy peak -->
        <polygon points="180,350 320,80 480,350" fill="url(#mntGrad)" />
        <!-- Snowy cap peak left side light -->
        <polygon points="320,80 345,130 320,150 295,130" fill="#ECEFF1" />
        <!-- Pine Tree silhouettes in foreground -->
        <path d="M 40 350 L 55 315 L 48 315 L 60 290 L 53 290 L 65 260 L 55 260 L 65 240 L 75 260 L 67 260 L 77 290 L 70 290 L 82 315 L 75 315 L 90 350 Z" fill="#2F3E46" />
        <path d="M 110 350 L 120 325 L 115 325 L 125 305 L 120 305 L 130 280 L 138 305 L 133 305 L 143 325 L 138 325 L 148 350 Z" fill="#1b2a22" />
        <!-- Lake reflection -->
        <rect x="0" y="325" width="500" height="25" fill="#A1C4FD" opacity="0.4" />
      </svg>
    `)
  },
  {
    id: 'city',
    name: 'Metropolis Skyline',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
        <defs>
          <linearGradient id="twilight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1A1C29" />
            <stop offset="60%" stop-color="#3C2A4D" />
            <stop offset="100%" stop-color="#6F4D7B" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#twilight)" />
        <!-- Moon -->
        <circle cx="90" cy="80" r="25" fill="#EAF2F8" opacity="0.5" />
        <!-- City Silhouettes back rows -->
        <rect x="30" y="160" width="60" height="190" fill="#251F30" opacity="0.8" />
        <rect x="130" y="120" width="70" height="230" fill="#251F30" opacity="0.8" />
        <polygon points="130,120 165,80 200,120" fill="#251F30" opacity="0.8" />
        <rect x="230" y="180" width="80" height="170" fill="#251F30" opacity="0.8" />
        <!-- Midground row with windows -->
        <rect x="80" y="140" width="80" height="210" fill="#131521" />
        <!-- Lit windows -->
        <circle cx="100" cy="160" r="3" fill="#FFE3A8" />
        <circle cx="120" cy="160" r="3" fill="#FFE3A8" />
        <circle cx="140" cy="160" r="3" fill="#FFE3A8" />
        <circle cx="100" cy="180" r="3" fill="#FFE3A8" />
        <circle cx="140" cy="180" r="3" fill="#FFE3A8" />
        <circle cx="100" cy="200" r="3" fill="#FFE3A8" />
        <circle cx="120" cy="200" r="3" fill="#FFE3A8" />
        <circle cx="140" cy="200" r="3" fill="#FFE3A8" />
        <!-- Tall tower -->
        <rect x="320" y="70" width="45" height="280" fill="#0E101A" />
        <line x1="342.5" y1="70" x2="342.5" y2="20" stroke="#E63946" stroke-width="2" />
        <circle cx="342.5" cy="20" r="3" fill="#E63946" />
        <!-- Small buildings in front -->
        <rect x="200" y="220" width="50" height="130" fill="#0A0B10" />
        <rect x="270" y="200" width="60" height="150" fill="#0A0B10" />
        <rect x="380" y="170" width="90" height="180" fill="#12131C" />
      </svg>
    `)
  },
  {
    id: 'portrait',
    name: 'Classical Statue Silhouette',
    url: createSvgDataUrl(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="500" height="350">
        <defs>
          <linearGradient id="portraitBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E2D4C9" />
            <stop offset="50%" stop-color="#C5B358" />
            <stop offset="100%" stop-color="#4A3B32" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#portraitBg)" opacity="0.8" />
        <!-- Styled Abstract Greek sculpture head vector silhouette -->
        <g transform="translate(150, 40)" fill="#1A1816">
          <path d="M 80 50 C 60 50, 45 65, 45 85 C 45 95, 50 110, 52 120 C 45 125, 42 135, 45 145 C 50 155, 60 160, 68 152 C 72 165, 80 185, 75 200 C 65 210, 55 220, 50 240 L 160 240 C 158 220, 150 205, 135 195 C 138 180, 142 155, 145 140 C 152 130, 155 120, 150 110 C 145 100, 138 102, 135 112 C 132 90, 120 60, 100 52 C 90 48, 85 50, 80 50 Z" />
          <!-- Flowing Roman hair patterns -->
          <path d="M 60 70 Q 75 60 90 75" stroke="#FFF" stroke-width="2.5" fill="none" opacity="0.6" />
          <path d="M 52 90 Q 72 80 92 98" stroke="#FFF" stroke-width="2.5" fill="none" opacity="0.6" />
          <path d="M 48 112 Q 74 100 90 118" stroke="#FFF" stroke-width="2.5" fill="none" opacity="0.6" />
          <!-- Eye/Nose shadow contours -->
          <path d="M 125 120 L 115 135 L 125 140" stroke="#FFF" stroke-width="2" fill="none" opacity="0.5" />
          <path d="M 115 135 M 105 130 Q 110 138 120 132" stroke="#FFF" stroke-width="1.5" fill="none" opacity="0.5" />
          <!-- Base Bust Pedestal -->
          <path d="M 50 240 L 40 260 L 170 260 L 160 240 Z" />
          <rect x="60" y="260" width="90" height="20" fill="#0A0908" />
        </g>
      </svg>
    `)
  }
];
