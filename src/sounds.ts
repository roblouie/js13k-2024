import { audioContext, biquadFilter, SimplestMidiRev2 } from '@/engine/audio/simplest-midi';

const defaults = {output:0,w:"sine",t:1,f:0,v:0.5,a:0,h:0.01,d:0.01,s:0,r:0.05,p:1,q:1,k:0}
export const bassDrum1 = [{ ...defaults, w:"triangle",t:0,f:88,v:1,d:0.05,h:0.03,p:0.5,q:0.1,},{ ...defaults, w:"n0",output:1,t:5,v:42,r:0.01,h:0,p:0,}];

const doorOpenStartingPOint = [{w:"sawtooth",v:0.4,a:1,h:1,s:0.5,},{g:1,w:"triangle",v:0.6,t:0,f:-0.1,a:0.5,h:1,s:1,r:0.01,b:0,c:0,p:-40,q:20,},{g:1,w:"n1",v:0.2,t:0,f:200,a:0.3,h:1,s:1,r:0.01,b:0,c:0,}];
const doorOpening2 = [{w:"sawtooth",v:0.4,r:0,a:1,h:1,s:0.5,},{g:1,w:"triangle",v:0.6,t:0,f:-0.3,a:2,h:1,d:1,s:0.5,r:0.01,b:0,c:0,},{g:1,w:"n0",v:0.05,t:0,f:200,a:0.3,h:1,s:1,r:0.01,b:0,c:0,}]
export const doorOpening3 = [{w:"sawtooth",v:0.4,r:0,a:1,h:1,s:0.5,},{g:1,w:"triangle",v:0.6,t:0,f:-0.4,a:2,h:1,d:1,s:0.5,r:0.01,b:0,c:0,p:-1,},{g:1,w:"n0",v:0.08,t:0,f:4,a:0.3,h:1,s:1,r:0.01,b:0,c:0,}];
const violin = [{ ...defaults, w:"sawtooth",v:0.4,a:0.1,d:0.2,},{ ...defaults, w:"sine",v:5,d:0.2,s:0.2,output:1,}];
const frenchHorn = [{ ...defaults, w:"square",v:0.1,a:0.1,d:0.5,s:0.5,r:0.08,},{ ...defaults, w:"sine",v:1,d:0.1,s:4,output:1,}];

export const song = expandSong('2P(322P*322P,322P.322Q0322P2322P4322Q6322R8322R:322R<322R>322S@322RB322RD322SF322MH322MJ322ML322MN322NP322MR322MT322NV3235(B<32(B<3/(B<3/8B<3,8B<3)8B<36HB<33HB<30HB<');
const instruments = [violin, frenchHorn];


const songPlayer = new SimplestMidiRev2();
songPlayer.volume.connect(biquadFilter)

export const playSong = () => {

  for (const note of song) {
    songPlayer.playNote(audioContext.currentTime + note[2], note[1],  note[4], instruments[note[0]], audioContext.currentTime + note[2] + note[3]);
  }
}

export function expandSong(noteString: string) {
  const notesets = noteString.match(/.{5}/g);
  return notesets.map(noteset => ([noteset.charCodeAt(0) - 50, noteset.charCodeAt(1), (noteset.charCodeAt(2) - 40) / 8, (noteset.charCodeAt(3) - 50) / 8, (noteset.charCodeAt(4) - 20)]));
}

// POTENTIAL FOOTSTEPS:
// 117 Taiko Drum 38 - 40 alternating


// POTENTIAL CREEPY MUSIC NOTES
// 113 Tinkle Bell - creepy chase / mood music
// 112 Shanai or 111 - base line??
