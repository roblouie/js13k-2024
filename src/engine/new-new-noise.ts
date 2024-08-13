import { toHeightmap } from '@/engine/svg-maker/svg-string-converters';

export async function newNoiseLandscape(size: number,seed_: number, baseFrequency: number, numOctaves_: number, type_: 'fractalNoise' | 'turbulentNoise', scale_: number) {
  const s = `<svg width="${256}" height="${256}" xmlns="http://www.w3.org/2000/svg">
    <filter id="n">
        <feTurbulence seed="${seed_}" baseFrequency="${baseFrequency}" numOctaves="${numOctaves_}" type="${type_}"/>
    </filter>
    <rect x="0" y="0" width="100%" height="100%" filter="url(#n)"/>
</svg>`;
  return toHeightmap(s, scale_);
}
