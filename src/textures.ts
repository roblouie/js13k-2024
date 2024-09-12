import { Material } from '@/engine/renderer/material';
import { textureLoader } from '@/engine/renderer/texture-loader';
import { toImage } from '@/engine/svg-maker/svg-string-converters';

export const materials: {[key: string]: Material} = {};

export async function initTextures() {
  materials.wood = new Material({ texture: textureLoader.load_(await wood())});
  materials.face = new Material({ texture: textureLoader.load_(await face())});
  materials.silver = new Material({ texture: textureLoader.load_(await metals('', 20)) });
  materials.iron = new Material({ texture: textureLoader.load_(await metals()) });
  materials.marble = new Material({ texture: textureLoader.load_(await marbleFloor())});
  materials.ceilingTiles = new Material({ texture: textureLoader.load_(await ceilingTiles())});
  materials.elevatorPanel = new Material({ texture: textureLoader.load_(await elevatorPanel())});
  materials.redCarpet = new Material({ texture: textureLoader.load_(await redCarpet())});
  materials.wallpaper = new Material({ texture: textureLoader.load_(await wallpaper(true))});
  materials.greenPlasterWall = new Material({ texture: textureLoader.load_(await wallpaper())});
  materials.white = new Material({ texture: textureLoader.load_(await color('#bbb'))});
  materials.red = new Material({ texture: textureLoader.load_(await color('#b00'))});

  for (let i = 1; i <= 13; i++) {
    materials[i] = new Material({ texture: textureLoader.load_(await roomSign(`13${i.toString().padStart(2, '0')}`))});
  }

  textureLoader.bindTextures();
}

function wallpaper(isPattern = false) {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><pattern id="b" width="128" height="128" patternUnits="userSpaceOnUse"><path fill="#687A5E" d="M0 0h128v128H0z"/>${isPattern ? '<text x="64" y="64" style="font-size:64px" stroke="#506546" fill="#506546">❀</text><text y="128" style="font-size:50px" stroke="#506546" fill="#506546">✦</text>' : ''}</pattern><filter id="a"><feTurbulence baseFrequency=".4" stitchTiles="stitch"/><feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#687A5E"><feDistantLight azimuth="120" elevation="45"/></feDiffuseLighting><feBlend in="SourceGraphic" mode="difference"/></filter><rect width="100%" height="100%" filter="url(#a)" fill="url(#b)"/></svg>`);
}

async function elevatorPanel() {
  const positions = [30, 50, 70];
  let percentY = 70;
  const button = (x: number, y: number, num: number) => {
    return `<ellipse cx="${x}%" cy="${y}%" rx="40" ry="40" fill="${num < 13 ? '#777' : '#ffa'}" stroke="black" stroke-width="4"></ellipse><text x="${x}%" dx="${num > 9 ? -30 : -14}" y="${y}%" dy="18" style="font-weight: bold; font-size: 60px;">${num}</text>`;
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

  return metals(content, 30);
}

function redCarpet() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><filter id="a"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2"/><feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#600" result="d"><feDistantLight azimuth="90" elevation="55"/></feDiffuseLighting></filter><rect width="100%" height="100%" filter="url(#a)"/></svg>`)
}

function ceilingTiles() {
  return toImage(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512"><pattern id="b" width="512" height="256" patternUnits="userSpaceOnUse"><path d="M8 7h502v248H8z"/></pattern><filter id="a"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="8"/><feComposite in="SourceGraphic" operator="arithmetic" k2=".5" k3=".5"/><feComponentTransfer result="n"><feFuncA type="gamma" exponent="4"/></feComponentTransfer><feDiffuseLighting color-interpolation-filters="sRGB" lighting-color="#fff" surfaceScale="-1" result="d"><feDistantLight azimuth="40" elevation="55"/></feDiffuseLighting></filter><rect width="100%" height="100%" filter="url(#a)" fill="url(#b)"/></svg>`)
}


function marbleFloor() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><pattern id="a" width="256" height="256" patternUnits="userSpaceOnUse"><circle r="290" fill="#fff"/><path d="M0 0h128v256h128V128H0z"/></pattern><filter id="b"><feTurbulence baseFrequency=".04" numOctaves="5"/><feColorMatrix values="1 -1 0 0 0 1 -1 0 0 0 1 -1 0 0 0 0 0 0 0 0.3"/><feBlend in="SourceGraphic" mode="soft-light"/></filter><rect width="100%" height="100%" fill="url(#a)" filter="url(#b)"/></svg>`)
}

function wood() {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><filter id="a"><feTurbulence type="fractalNoise" baseFrequency="0.1, 0.007" numOctaves="6" stitchTiles="stitch"/><feComposite in="s" operator="arithmetic" k2=".5" k3=".6"/><feComponentTransfer><feFuncA type="table" tableValues="0, .1, .2, .3, .4, .2, .4"/></feComponentTransfer><feDiffuseLighting color-interpolation-filters="sRGB" surfaceScale="3" lighting-color="#6e3f2b"><feDistantLight azimuth="110" elevation="48"/></feDiffuseLighting></filter><rect height="100%" width="100%" filter="url(#a)"/></svg>`)
}

export function face() {
  return toImage(`<svg style="filter: invert()" width="512" height="512" xmlns="http://www.w3.org/2000/svg"><filter id="a" x="-0.01%" primitiveUnits="objectBoundingBox" width="100%" height="100%"><feTurbulence seed="7" type="fractalNoise" baseFrequency="0.005" numOctaves="5" result="n"/><feComposite in="SourceAlpha" operator="in"/><feDisplacementMap in2="n" scale="0.9"/></filter><rect x="0" y="-14" width="100%" height="100%" id="l" filter="url(#a)"/><rect fill="#fff" width="100%" height="100%"/><use href="#l" x="22%" y="42" transform="scale(2.2, 1.2)"></use><use href="#l" x="-22%" y="42" transform="rotate(.1) scale(-2.2 1.2)"></use><rect fill="#777" x="220" y="230" width="50" height="50"/></svg>`);
}

export function metals(content = '', brightnessModifier = 1) {
  const value = 0.01 * brightnessModifier;
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><filter id="b"><feTurbulence baseFrequency="0.01,0.0008" numOctaves="2" seed="23" type="fractalNoise" stitchTiles="stitch" /><feColorMatrix values="${value}, ${value}, ${value}, 0, 0,${value}, ${value}, ${value}, 0, 0,${value}, ${value}, ${value}, 0, 0,1, 1, 1, 1, 1"/></filter><rect x="0" y="0" width="100%" height="100%" filter="url(#b)"/>${ content }</svg>`);
}

function roomSign(roomNumber: string) {
  return metals(`<text x="21%" y="42%" font-size="150px" style="transform: scaleY(1.5)">${roomNumber}</text>`, 30)
}

function color(color: string | number) {
  return toImage(`<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="100%" height="100%" fill="${color}"/></svg>`)
}
