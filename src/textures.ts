import { Material } from '@/engine/renderer/material';
import { textureLoader } from '@/engine/renderer/texture-loader';
import { toImage, toHeightmap } from '@/engine/svg-maker/svg-string-converters';

const textureSize = 512;

export const materials: {[key: string]: Material} = {};

export async function initTextures() {
  // @ts-ignore
  // materials.grass.texture!.textureRepeat.x = 160;
  // materials.grass.texture!.textureRepeat.y = 10;

  materials.brickWall = new Material({ texture: textureLoader.load_(await bricksRocksPlanksWood(true, true))});
  materials.brickWall.texture?.textureRepeat.set(1.5, 1.5);
  materials.stone = new Material({texture: textureLoader.load_(await bricksRocksPlanksWood(true, false))});
  materials.wood = new Material({ texture: textureLoader.load_(await bricksRocksPlanksWood(false, false))});
  materials.planks = new Material({ texture: textureLoader.load_(await bricksRocksPlanksWood(false, true))});
  materials.face = new Material({ texture: textureLoader.load_(await face())});
  materials.bloodCircle = new Material({ texture: textureLoader.load_(await drawBloodCircle()), isTransparent: true });
  materials.gold = new Material({ texture: textureLoader.load_(await metals(0)), emissive: [0.7, 0.7, 0.7, 0.7] });
  materials.silver = new Material({ texture: textureLoader.load_(await metals(1)) });
  materials.iron = new Material({ texture: textureLoader.load_(await metals(2)) });
  materials.banner = new Material({ texture: textureLoader.load_(await banner()) });
  materials.water = new Material({ texture: textureLoader.load_(...(await drawWater()))});
  materials.marble = new Material({ texture: textureLoader.load_(await marbleFloor())});
  materials.parquetFloor = new Material({ texture: textureLoader.load_(await parquetFloor())});
  materials.texturedWallpaper = new Material({ texture: textureLoader.load_(await texturedWallpaper())});
  materials.patternedWallpaper = new Material({ texture: textureLoader.load_(await patternedWallpaper())});
  materials.tinyTiles = new Material({ texture: textureLoader.load_(await tinyTiles())});
  materials.lighterWoodTest = new Material({ texture: textureLoader.load_(await lighterWoodTest())});
  materials.ceilingTiles = new Material({ texture: textureLoader.load_(await ceilingTiles())});
  materials.elevatorPanel = new Material({ texture: textureLoader.load_(await elevatorPanel())});
  materials.redCarpet = new Material({ texture: textureLoader.load_(await redCarpet())});
  materials.potentialPlasterWall = new Material({ texture: textureLoader.load_(await potentialPlasterWall())});

  textureLoader.bindTextures();
}

async function elevatorPanel() {
  const positions = [30, 50, 70];
  let percentY = 70;
  const button = (x: number, y: number, num: number) => {
    return `
    <ellipse cx="${x}%" cy="${y}%" rx="40" ry="40" fill="${num < 13 ? '#777' : '#ffa'}" stroke="black" stroke-width="4"></ellipse>
    <text x="${x}%" dx="${num > 9 ? -30 : -14}" y="${y}%" dy="18" style="font-weight: bold; font-size: 60px;">${num}</text>
    `;
  };
  let content = button(50, 90, 1);
  for (let i = 0; i < 12; i++) {
    const row = i % 3;
    if (i > 0 && row === 0) {
      percentY -= 20;
    }
    const percentX = positions[row];
    content += button(percentX, percentY, i + 2);
  }

  return metals(content);
}

function potentialPlasterWall() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".01" numOctaves="5"/>
        <feComponentTransfer result="n">
            <feFuncA type="gamma" exponent="4"/>
        </feComponentTransfer>
        <feDiffuseLighting lighting-color="#ddd" surfaceScale="2" result="d">
            <feDistantLight azimuth="90" elevation="45"/>
        </feDiffuseLighting>
        
        <feBlend in2="d"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#filter)"/>
</svg>`)
}

function redCarpet() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2"/>
        
        <feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#800" surfaceScale="1" result="d">
            <feDistantLight azimuth="90" elevation="55"/>
        </feDiffuseLighting>
    </filter>
    <rect width="100%" height="100%" filter="url(#filter)"/>
</svg>`)
}

function lighterWoodTest() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <filter x="0" y="0" width="100%" height="100%" id="rw">
        <feTurbulence type="fractalNoise" baseFrequency="0.1,0.007" numOctaves="7" stitchTiles="stitch"/>
        <feComposite in="s" operator="arithmetic" k2="0.5" k3="0.5"/>
        <feComponentTransfer>
            <feFuncA type="table" tableValues="0, .1, .2, .3, .4, .2, .4, .2, .4"/>
        </feComponentTransfer>
        <feDiffuseLighting color-interpolation-filters="sRGB" surfaceScale="1.5" lighting-color="#a88d5e">
            <feDistantLight azimuth="110" elevation="50"/>
        </feDiffuseLighting>
    </filter>
    <rect height="100%" width="100%" x="0" y="0" fill="" filter="url(#rw)"/>
</svg>`)
}

function ceilingTiles() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
 <pattern id="p2" width="512" height="256" patternUnits="userSpaceOnUse">
         <rect x="8" y="7" width="502" height="248" />
    </pattern>
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="8"/>
                                <feComposite in="SourceGraphic" operator="arithmetic" k2="0.5" k3="0.5"/>

        <feComponentTransfer result="n">
            <feFuncA type="gamma" exponent="4"/>
        </feComponentTransfer>
        <feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#fff" surfaceScale="-1" result="d">
            <feDistantLight azimuth="40" elevation="55"/>
        </feDiffuseLighting>
        

    </filter>
    <rect width="100%" height="100%" filter="url(#filter)" fill="url(#p2)"/>
</svg>`)
}

function tinyTiles() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <pattern id="p" width="30" height="30" patternUnits="userSpaceOnUse">
       <rect x="5" y="5" width="20" height="20" />
    </pattern>
    <filter x="0" y="0" width="100%" height="100%" id="rw">
        <feDropShadow dx="1" dy="1" result="s"/>
       
        <feComposite in="s" operator="arithmetic" k2="0.5" k3="0.5"/>
        <feComponentTransfer>
            <feFuncA type="table" tableValues="0, .1, .2, .3, .4, .2, .4, .2, .4"/>
        </feComponentTransfer>
        <feDiffuseLighting color-interpolation-filters="sRGB" surfaceScale="2.5" lighting-color="#9f8">
            <feDistantLight azimuth="180" elevation="34"/>
        </feDiffuseLighting>
    </filter>
    <rect height="100%" width="100%" x="0" y="0" fill="url(#p)" filter="url(#rw)"/>
</svg>
`);
}

function patternedWallpaper() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <filter id="filter">
        <feTurbulence baseFrequency=".004 .1"/>
        <feColorMatrix values="0 0 0 1 0
                               0 .3 0 0 0
                               0 0 0 0 0
                               0 0 0 0 1"/>
    </filter>
    <pattern id="pattern" width="1" height="1" patternTransform="skewY(60)">
        <rect width="100%" height="100%" filter="url(#filter)"/>
    </pattern>
    <g id="g">
        <rect id="r" width="25.1%" height="100%" fill="url(#pattern)"/>
        <use href="#r" x="49.9%"/>
    </g>
    <use href="#g" x="-100%" transform="scale(-1 1)"/>
</svg>`)
}

function texturedWallpaper() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <pattern id="pattern" width="3" height="2" patternUnits="userSpaceOnUse">
        <circle r="4" fill="#875"/>
        <rect width="1" height="1"/>
    </pattern>
    <filter id="filter">  
      <feTurbulence baseFrequency=".02 .002" numOctaves="3"/>
      <feDisplacementMap in="SourceGraphic" scale="9"/>
    </filter>
    <rect x="-10%" y="-10%" width="120%" height="120%" fill="url(#pattern)" filter="url(#filter)"/>
</svg>`)
}

function parquetFloor() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <pattern id="pattern" width="256" height="256" patternUnits="userSpaceOnUse">
        <path id="p" d="M.5.5v127h42V.5h1v127h42V.5h1v127h42V.5" fill="#da6"/>
        <use href="#p" x="128" y="128"/>
    </pattern>
    <filter id="filter">
        <feTurbulence type="fractalNoise" baseFrequency=".1 .01" numOctaves="3"/>
        <feComposite in="SourceGraphic" operator="in"/>
        <feBlend in="SourceGraphic" mode="difference"/>
    </filter>
    <g id="o">
        <circle r="71%"/>
        <circle id="c" r="71%" fill="url(#pattern)" filter="url(#filter)"/>
        <use href="#c" transform="rotate(90)"/>
    </g>
    <use href="#o" x="50%" y="50%"/>
</svg>`)
}

function marbleFloor() {
  // new marble floor??
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <pattern id="pattern" width="256" height="256" patternUnits="userSpaceOnUse">
        <circle r="290" fill="white"/>
        <path d="M0 0H128V256H256V128H0z"/>
    </pattern>
    <filter id="filter">
        <feTurbulence baseFrequency=".04" numOctaves="5"/>
        <feColorMatrix values="1 -1 0 0 0
                               1 -1 0 0 0
                               1 -1 0 0 0
                               0 0 0 0 0.3"/>
        <feBlend in="SourceGraphic" mode="soft-light"/>
        
    </filter>
    <rect width="100%" height="100%" fill="url(#pattern)" filter="url(#filter)"/>
</svg>`)

//   return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
//     <pattern id="pattern" width="256" height="256" patternUnits="userSpaceOnUse">
//         <circle r="290" fill="red"/>
//         <path d="M0 0H128V256H256V128H0z"/>
//     </pattern>
//     <filter id="filter">
//         <feTurbulence baseFrequency=".04" numOctaves="4"/>
//         <feBlend in="SourceGraphic" mode="lighten"/>
//         <feColorMatrix values="1 -1 0 0 0
//                                1 -1 0 0 0
//                                1 -1 0 0 0
//                                0 0 0 0 1"/>
//     </filter>
//     <rect width="100%" height="100%" fill="url(#pattern)" filter="url(#filter)"/>
// </svg>`)
}

function drawWaterDarkBlue() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <filter id="filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence baseFrequency=".007" numOctaves="3" seed="1">
          <animate
            attributeName="baseFrequency"
            values=".007;0.01;0.007"
            dur="10s"
            repeatCount="indefinite" />
        </feTurbulence>
        <feComponentTransfer>
            <feFuncA type="gamma" amplitude="-0.9" exponent=".1" offset="1.2"/>
        </feComponentTransfer>
        <feColorMatrix values="0 0 0 1 -1
                           0 0 0 1 -0.4
                           1 0 0 1 0
                           0 0 0 0 1"/>
        <feBlend in="SourceGraphic" mode="color"/>
    </filter>
    <rect width="100%" height="100%" fill="blue" filter="url(#filter)"/>
</svg>
`)
}

async function attemptAnimated() {
  const image = await toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg" style="background-color:blue">
    <linearGradient id="g3">
        <stop offset="0" stop-color="black"/>
        <stop offset="0.1" stop-color="white"/>
        <stop offset="0.9" stop-color="white"/>
        <stop offset="1" stop-color="black"/>
    </linearGradient>
    <linearGradient id="g2" gradientTransform="rotate(90)">
        <stop offset="0" stop-color="black"/>
        <stop offset="0.1" stop-color="white"/>
        <stop offset="0.9" stop-color="white"/>
        <stop offset="1" stop-color="black"/>
    </linearGradient>
    <mask id="m2">
        <rect fill="url(#g3)" height="100%" width="100%" x="0" y="0"/>
    </mask>
    <mask id="m1">
        <rect fill="url(#g2)" height="100%" width="100%" x="0" y="0"/>
    </mask>
    <g mask="url(#m2)">
    <filter id="filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence baseFrequency=".007" numOctaves="3" seed="1">
            <animate
                    attributeName="baseFrequency"
                    values=".007;0.008;0.007"
                    dur="20s"
                    repeatCount="indefinite" />
        </feTurbulence>
        <feComponentTransfer>
            <feFuncA type="gamma" amplitude="-0.9" exponent=".1" offset="1.2">
                <animate
                        attributeName="offset"
                        values="1.2;1.25;1.2"
                        dur="4s"
                        repeatCount="indefinite" />
            </feFuncA>
        </feComponentTransfer>
        <feColorMatrix values="0 0 0 1 -1
                           0 0 0 1 -0.4
                           1 0 0 1 0
                           0 0 0 0 1"/>
        <feBlend in="SourceGraphic" mode="color"/>
    </filter>

    <rect width="100%" height="100%" fill="blue" filter="url(#filter)" mask="url(#m1)"/>
    </g>
</svg>
`)

  document.body.appendChild(image);

  function test() {
  }

  return [image, test];

}

function drawWaterLightAqua() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <filter id="filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence baseFrequency=".007" numOctaves="3" seed="1" stitchTiles="stitch">
        </feTurbulence>
        <feComponentTransfer>
            <feFuncA type="gamma" amplitude="-.8" exponent=".2" offset="1.3"/>
        </feComponentTransfer>
        <feColorMatrix values="0 0 0 1 0
                           0 0 0 1 0
                           0 0 0 1 0
                           0 0 0 0 1"/>
        <feBlend in="SourceGraphic" mode="color"/>
    </filter>
    <rect width="100%" height="100%" fill="aqua" filter="url(#filter)"/>
</svg>
`)
}

function drawWater() {
  return attemptAnimated()
}

function drawWaterDarkerAqua() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <filter id="filter" x="0" y="0" width="100%" height="100%">
        <feTurbulence baseFrequency=".007" numOctaves="3" seed="1" stitchTiles="stitch">
        </feTurbulence>
        <feComponentTransfer>
            <feFuncA type="gamma" amplitude="-0.7" exponent=".1" offset="1.2"/>
        </feComponentTransfer>
        <feColorMatrix values="0 0 0 1 -0.4
                           0 0 0 1 -0.4
                           1 0 0 1 0.4
                           0 0 0 0 1"/>
        <feBlend in="SourceGraphic" mode="color"/>
    </filter>
    <rect width="100%" height="100%" fill="#00bcd4" filter="url(#filter)"/>
</svg>`)
}





function stars() {
  return `<filter x="0" y="0" width="100%" height="100%" id="s"><feTurbulence baseFrequency="0.2" stitchTiles="stitch" /><feColorMatrix values="0, 0, 0, 9, -5.5, 0, 0, 0, 9, -5.5, 0, 0, 0, 9, -5.5, 0, 0, 0, 0, 1"/></filter>`;
}



function getPattern(width_ = 160, height_ = 256) {
  return `<pattern id="p" width="${width_}" height="${height_}" patternUnits="userSpaceOnUse"><path d="m 0 246 h 148 V 125 H 0 V112 h72 V0 h15 v112 h 74 V 0 H 0"/></pattern>`;
}

function rockWoodFilter(isRock = true) {
  return `<filter x="0" y="0" width="100%" height="100%" id="rw"><feDropShadow dx="${isRock ? 1 : 300}" dy="${isRock ? 1 : 930}" result="s"/><feTurbulence type="fractalNoise" baseFrequency="${isRock ? 0.007 : [0.1, 0.007]}" numOctaves="${isRock ? 9 : 6}" stitchTiles="stitch" /><feComposite in="s" operator="arithmetic" k2="0.5" k3="0.5" /><feComponentTransfer><feFuncA type="table" tableValues="0, .1, .2, .3, .4, .2, .4, .2, .4"/></feComponentTransfer><feDiffuseLighting color-interpolation-filters="sRGB" surfaceScale="2.5" lighting-color="${isRock ? '#ffd' : '#6e5e42'}"><feDistantLight azimuth="${isRock ? 265 : 110}" elevation="${isRock ? 4 : 10}"/></feDiffuseLighting></filter>`;
}

function bricksRocksPlanksWood(isRock = true, isPattern = true) {
  return toImage(`<svg width="${textureSize}" height="${textureSize}" xmlns="http://www.w3.org/2000/svg">${isPattern ? getPattern( isRock ? 160 : 75, isRock ? 256 : 1) : ''}${rockWoodFilter(isRock)}<rect height="100%" width="100%" x="0" y="0" fill="${isPattern ? 'url(#p)' : ''}" filter="url(#rw)"/></svg>`);
}

export function drawBloodCircle() {
  return toImage(`<svg width="${textureSize}" height="${textureSize}" xmlns="http://www.w3.org/2000/svg">${bloodEffect(`<ellipse cx="256" cy="256" rx="220" ry="220" filter="url(#d)"/>`, 250, [0.03, 0.03])}</svg>`);
}

export function drawBloodText(x: number | string, y: number | string, style: string | undefined, textToDisplay: string, scale = 70) {
  return bloodEffect(`<text x="${x}" y="${y}" style="${style ?? 'font-size: 360px; transform: scaleY(1.5);'}" filter="url(#d)">${textToDisplay}</text>`, scale)
}

export function bloodEffect(component: string, scale_ = 70, freq1: [number, number] = [0.13, 0.02], freq2 = 0.04) {
  return `<filter id="d"><feTurbulence baseFrequency="${freq1}" numOctaves="1" type="fractalNoise" result="d"/><feDisplacementMap in="SourceGraphic" in2="d" scale="${scale_}"/></filter><filter id="b"><feTurbulence baseFrequency="${freq2}" numOctaves="1" type="fractalNoise"/><feColorMatrix values="0.4, 0.2, 0.2, 0, -0.1, 0, 2, 0, 0, -1.35, 0, 2, 0, 0, -1.35, 0, 0, 0, 0, 1"/><feComposite in2="SourceGraphic" operator="in"/></filter><g filter="url(#b)">${component}</g>`;
}

export function face() {
  return toImage(`<svg width="${textureSize}" height="${textureSize}" xmlns="http://www.w3.org/2000/svg"><filter id="filter" x="-0.01%" primitiveUnits="objectBoundingBox" width="100%" height="100%"><feTurbulence seed="7" type="fractalNoise" baseFrequency="0.005" numOctaves="5" result="n"/><feComposite in="SourceAlpha" operator="in"/><feDisplacementMap in2="n" scale="0.9"/></filter><rect x="0" y="-14" width="100%" height="100%" id="l" filter="url(#filter)"/><rect fill="#fff" width="100%" height="100%"/><use href="#l" x="22%" y="42" transform="scale(2.2, 1.2)"></use><use href="#l" x="-22%" y="42" transform="rotate(.1) scale(-2.2 1.2)"></use><rect fill="#777" x="220" y="230" width="50" height="50"/></svg>`);
}

export function metals(content: string, isHeightmap = false) {
  const method = isHeightmap ? toHeightmap : toImage;
  return method(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
<filter id="b">
<feTurbulence baseFrequency="0.01,0.0008" numOctaves="2" seed="23" type="fractalNoise" stitchTiles="stitch" />
<feColorMatrix values="
0.2, 0.2, 0.2, 0,
-0.01, 0.2, 0.2, 0.2,
0, -0.01, 0.2 ,0.2,
0.2,0,-0.01,0.2,
0,0,0,1"/>
</filter>
<rect x="0" y="0" width="100%" height="100%" filter="url(#b)"/>
${ content ? content : '' }
</svg>`, 1);
}

export function testHeightmap() {
  return metals(1, true);
}


const bannerColor = '#460c0c';

function banner() {
  return toImage(`<svg width="${textureSize}" height="${textureSize}" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="${bannerColor}"></rect></svg>`);
}
