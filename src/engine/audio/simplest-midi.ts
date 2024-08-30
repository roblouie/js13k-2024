export const audioContext: AudioContext = new (window.AudioContext || window.webkitAudioContext)();

class SimplestMidi {
  masterTuningC = 0;
  masterTuningF = 0;
  scaleTuning: number[][] = [];
  tuningC: number[] = [];
  tuningF: number[] = [];
  chvol: GainNode[] = [];
  chPanner: PannerNode[] = [];
  chmod: GainNode[] = [];
  noiseBuf: { n0: AudioBuffer, n1: AudioBuffer };
  bend: number[] = [];
  wave: { [key: string]: PeriodicWave };
  compressor: DynamicsCompressorNode;

  constructor() {
    const blen = audioContext.sampleRate * 0.5;
    this.compressor = audioContext.createDynamicsCompressor();
    this.noiseBuf={};
    this.noiseBuf.n0 = audioContext.createBuffer(1,blen,audioContext.sampleRate);
    this.noiseBuf.n1 = audioContext.createBuffer(1,blen,audioContext.sampleRate);
    var dn=this.noiseBuf.n0.getChannelData(0);
    var dr=this.noiseBuf.n1.getChannelData(0);
    for(let i=0;i<blen;++i){
      dn[i]=Math.random()*2-1;
    }
    for(let jj=0;jj<64;++jj){
      const r1=Math.random()*10+1;
      const r2=Math.random()*10+1;
      for(let i=0;i<blen;++i){
        var dd=Math.sin((i/blen)*2*Math.PI*440*r1)*Math.sin((i/blen)*2*Math.PI*440*r2);
        dr[i]+=dd/8;
      }
    }

    this.wave={"w9999":this._createWave("w9999")};

    this.compressor.connect(audioContext.destination);
    this.compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
    this.compressor.knee.setValueAtTime(40, audioContext.currentTime);
    this.compressor.ratio.setValueAtTime(12, audioContext.currentTime);
    this.compressor.attack.setValueAtTime(0, audioContext.currentTime);
    this.compressor.release.setValueAtTime(0.25, audioContext.currentTime);

    for(let i=0;i<16;++i) {
      this.chvol[i] = audioContext.createGain();
      this.chmod[i]= audioContext.createGain();
      this.chPanner[i] = new PannerNode(audioContext, {
        distanceModel: 'linear',
        positionX: 0,
        positionY: 0,
        positionZ: 0,
        maxDistance: 80,
        rolloffFactor: 99,
        coneOuterGain: 0.1
      });
      this.chvol[i].connect(this.chPanner[i]).connect(this.compressor); // TODO: Make one of these for each node
      this.bend[i] = 0;
      this.scaleTuning[i]=[0,0,0,0,0,0,0,0,0,0,0,0];
      this.tuningC[i]=0;
      this.tuningF[i]=0;
    }
  }

  clearAll() {
    this.chmod.forEach(mod => mod.disconnect());
  }

  playNote(t,ch,n,v,p, kt, pannerSettings?: PannerOptions) {
    this.chPanner[ch].positionX.value = pannerSettings?.positionX ?? 0;
    this.chPanner[ch].positionZ.value = pannerSettings?.positionZ ?? 0;
    let out,sc,pn;
    const o: any[] =[]; // Oscillator or audiobuffersourcenode
    const g: GainNode[] = [];
    const vp=[];
    const fp=[];
    const r=[];
    const f=440*Math.pow(2,(n-69 + this.masterTuningC + this.tuningC[ch] + (this.masterTuningF + this.tuningF[ch]/8192 + this.scaleTuning[ch][n%12]))/12);
    for(let i=0;i<p.length;++i){
      pn=p[i];
      // seems to add current time to the attack and hold of the note
      const dt=t+pn.a+pn.h;
      if(pn.g==0) {
        // chvol should be a gain node
        out=this.chvol[ch];
        sc=v*v/16384;
        // pn.t is tune factor according to note#
        // pn.f is fixed frequency in Hz.
        // This seems to be using these values to get the frequency of the note
        fp[i]=f*pn.t+pn.f;
      }
      else if (pn.g > 10) {
        out = g[pn.g-11].gain;
        sc = 1;
        fp[i] = fp[pn.g-11] * pn.t + pn.f;
      }
      else if(o[pn.g - 1].frequency) {
        out = o[pn.g - 1].frequency;
        sc = fp[pn.g - 1];
        fp[i] = fp[pn.g - 1] * pn.t + pn.f;
      }
      else {
        out=o[pn.g - 1].playbackRate;
        sc = fp[pn.g - 1] / 440;
        fp[i] = fp[pn.g - 1] * pn.t + pn.f;
      }
      switch(pn.w[0]){
        case "n":
          o[i]=audioContext.createBufferSource();
          o[i].buffer=this.noiseBuf[pn.w];
          o[i].loop=true;
          o[i].playbackRate.value=fp[i]/440;
          if(pn.p!=1)
            this._setParamTarget(o[i].playbackRate,fp[i]/440*pn.p,t,pn.q);
          if (o[i].detune) {
            this.chmod[ch].connect(o[i].detune);
            o[i].detune.value=this.bend[ch];
          }
          break;
        default:
          // Creates oscillator for notes that aren't noise based
          o[i]=audioContext.createOscillator();

          // sets the frequency as determined in the previous part
          o[i].frequency.value=fp[i];

          // If there's a pitch bend set the frequency at time using q which is the pitch bend speed factor
          if(pn.p!=1)
            this._setParamTarget(o[i].frequency,fp[i]*pn.p,t,pn.q);

          // For instruments with the custom wave of 0999, here 'w999', set the periodic wave
          if(pn.w[0]=="w")
            o[i].setPeriodicWave(this.wave[pn.w]);
          else
            o[i].type=pn.w; // Wave type is set here for set wave types like sine, triangle, etc
          if (o[i].detune) {
            this.chmod[ch].connect(o[i].detune);
            o[i].detune.value=this.bend[ch];
          }
          break;
      }
      g[i]=audioContext.createGain(); // gain node for this note
      r[i]=pn.r; // release time for this note
      o[i].connect(g[i]); // connect the oscillator to the gain node
      g[i].connect(out); // connect the gain node to the output
      vp[i]=sc*pn.v; // pn.v is volume, but not 100% sure on vp[i], but sees to set volume
      if(pn.k) // pn.k is volume key tracking factor. Som adjustment is made to volume based on this if present
        vp[i]*=Math.pow(2,(n-60)/12*pn.k);
      if(pn.a){ // pn.a is attack, and the following code sets the attack by setting gain to 0 then ramping to volume at time
        g[i].gain.value=0;
        g[i].gain.setValueAtTime(0,t);
        g[i].gain.linearRampToValueAtTime(vp[i],t+pn.a);
      }
      else // if there's no attack, just set the gain to the volume at time
        g[i].gain.setValueAtTime(vp[i],t);
      this._setParamTarget(g[i].gain,pn.s*vp[i],dt,pn.d); // sets decay / off of the note, based on whether there is a decay (pn.d)
      o[i].start(t); // start the oscillator

      for(let k=g.length-1;k>=0;--k){
        g[k].gain.cancelScheduledValues(kt);
        this._setParamTarget(g[k].gain,0,kt,pn.d);
        o[i].stop(kt + pn.d);
      }
    }
  }

  private _setParamTarget(p,v,t,d) {
    if(d!=0) // If there's a decay
      p.setTargetAtTime(v,t,d); // use setTargetAtTime to gradually adjust to new value
    else
      p.setValueAtTime(v,t); // otherwise set it instantly at time
  }

  private _createWave(w) {
    const imag=new Float32Array(w.length);
    const real=new Float32Array(w.length);
    for(let i=1;i<w.length;++i)
      imag[i]=w[i];
    return audioContext.createPeriodicWave(real,imag);
  }
}

export const simplestMidi = new SimplestMidi();
