export const audioContext = new AudioContext();
export const compressor = audioContext.createDynamicsCompressor();
export const biquadFilter = audioContext.createBiquadFilter();
biquadFilter.type = 'lowshelf';
biquadFilter.frequency.value = 500;
biquadFilter.gain.value = 20;
biquadFilter.connect(compressor);
compressor.threshold.value = -50;
compressor.knee.value = 40;
compressor.ratio.value = 12;
compressor.connect(audioContext.destination);

type InstrumentData = {
  output: number; // Output destination, 0= output, n = fm to specified oscillator
  w: 'sawtooth' | 'square' | 'triangle' | 'sine' | 'n0' | 'n1'; // waveform
  v: number; // volume
  t: number; // tune factor according to note#
  f: number; // fixed frequency in Hz
  a: number; // attack time
  h: number; // hold time
  d: number; // decay time
  s: number; // sustain level
  r: number; // release time
  p: number; // pitch bend
  q: number; // pitch bend speed factor
  k: number; // volume key tracking factor
}

const blen = audioContext.sampleRate * 0.5;
const noiseBuf={};
noiseBuf['n0'] = audioContext.createBuffer(1,blen,audioContext.sampleRate);
noiseBuf['n1'] = audioContext.createBuffer(1,blen,audioContext.sampleRate);
for(let i=0;i<blen;++i){
  noiseBuf['n0'].getChannelData(0)[i]=Math.random()*2-1;
}
for(let jj=0;jj<64;++jj){
  const r1=Math.random()*10+1;
  const r2=Math.random()*10+1;
  for(let i=0;i<blen;++i){
    const dd=Math.sin((i/blen)*2*Math.PI*440*r1)*Math.sin((i/blen)*2*Math.PI*440*r2);
    noiseBuf['n1'].getChannelData(0)[i]+=dd/8;
  }
}

export class SimplestMidiRev2 {
  volume_ = audioContext.createGain();
  modulator = audioContext.createGain();
  bend = 0;

  constructor() {}

  playNote(startTime: number, note: number, volume: number,instrumentDatas: InstrumentData[], duration: number) {
    let out;
    let sc;
    const o: any[] =[]; // Oscillator or audiobuffersourcenode
    const g: GainNode[] = [];
    const vp=[];
    const fp=[];
    const releases=[];
    const frequency=440*2**((note-69)/12);
    for(let i=0;i<instrumentDatas.length;++i) {
      const instrumentInfo=instrumentDatas[i];

      if(instrumentInfo.output === 0) {
        out=this.volume_;
        sc=volume*volume/16384;
        // pn.t is tune factor according to note#
        // pn.f is fixed frequency in Hz.
        // This seems to be using these values to get the frequency of the note
        fp[i]=frequency*instrumentInfo.t+instrumentInfo.f;
      }
      else if(o[instrumentInfo.output - 1].frequency) {
        out = o[instrumentInfo.output - 1].frequency;
        sc = fp[instrumentInfo.output - 1];
        fp[i] = fp[instrumentInfo.output - 1] * instrumentInfo.t + instrumentInfo.f;
      }
      else {
        out=o[instrumentInfo.output - 1].playbackRate;
        sc = fp[instrumentInfo.output - 1] / 440;
        fp[i] = fp[instrumentInfo.output - 1] * instrumentInfo.t + instrumentInfo.f;
      }
      switch(instrumentInfo.w[0]){
        case "n":
          o[i]=audioContext.createBufferSource();
          o[i].buffer=noiseBuf[instrumentInfo.w];
          o[i].loop=true;
          o[i].playbackRate.value=fp[i]/440;
          if(instrumentInfo.p!=1)
            this._setParamTarget(o[i].playbackRate,fp[i]/440*instrumentInfo.p,startTime,instrumentInfo.q);
          if (o[i].detune) {
            this.modulator.connect(o[i].detune);
            o[i].detune.value=this.bend;
          }
          break;
        default:
          // Creates oscillator for notes that aren't noise based
          o[i]=audioContext.createOscillator();

          // sets the frequency as determined in the previous part
          o[i].frequency.value=fp[i];

          // If there's a pitch bend set the frequency at time using q which is the pitch bend speed factor
          if(instrumentInfo.p!=1)
            this._setParamTarget(o[i].frequency,fp[i]*instrumentInfo.p,startTime,instrumentInfo.q);

          o[i].type=instrumentInfo.w; // Wave type is set here for set wave types like sine, triangle, etc
          if (o[i].detune) {
            this.modulator.connect(o[i].detune);
            o[i].detune.value=this.bend;
          }
          break;
      }
      g[i]=audioContext.createGain(); // gain node for this note
      releases[i]=instrumentInfo.r; // release time for this note
      o[i].connect(g[i]); // connect the oscillator to the gain node
      g[i].connect(out); // connect the gain node to the output
      vp[i]=sc*instrumentInfo.v; // pn.v is volume, but not 100% sure on vp[i], but sees to set volume
      if(instrumentInfo.k) // pn.k is volume key tracking factor. Som adjustment is made to volume based on this if present
        vp[i]*=2**((note-60)/12*instrumentInfo.k);
      if(instrumentInfo.a){ // pn.a is attack, and the following code sets the attack by setting gain to 0 then ramping to volume at time
        g[i].gain.value=0;
        g[i].gain.setValueAtTime(0,startTime);
        g[i].gain.linearRampToValueAtTime(vp[i],startTime+instrumentInfo.a);
      }
      else // if there's no attack, just set the gain to the volume at time
        g[i].gain.setValueAtTime(vp[i],startTime);

      const startupDuration=startTime+instrumentInfo.a+instrumentInfo.h;
      this._setParamTarget(g[i].gain,instrumentInfo.s*vp[i],startupDuration,instrumentInfo.d); // sets decay / off of the note, based on whether there is a decay (pn.d)
      o[i].start(startTime); // start the oscillator

      // Stop oscillators when they finish
      for(let k=g.length-1;k>=0;--k){
        g[k].gain.cancelScheduledValues(instrumentInfo.d + duration);
        this._setParamTarget(g[k].gain,0,duration,instrumentInfo.d);
        o[i].stop(duration + instrumentInfo.d);
      }
    }
  }

  private _setParamTarget(p,v,t,duration: number) {
    if(duration!=0) // If there's a duration
      p.setTargetAtTime(v,t,duration); // use setTargetAtTime to gradually adjust to new value
    else
      p.setValueAtTime(v,t); // otherwise set it instantly at time
  }
}
