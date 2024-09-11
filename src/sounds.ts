const defaults = {output:0,w:"sine",t:1,f:0,v:0.5,a:0,h:0.01,d:0.01,s:0,r:0.05,p:1,q:1,k:0}
export const footstep = [{ ...defaults, w:"triangle",v:0.7,t:0.5,d:0.2,r:0.2,p:0.95,},{ ...defaults, w:"n1",v:9,output:1,d:0.2,r:0.2,}]
export const violin = [{ ...defaults, w:"sawtooth",v:0.4,a:0.1,d:0.2,},{ ...defaults, w:"sine",v:5,d:0.2,s:0.2,output:1,}];
export const frenchHorn = [{ ...defaults, w:"square",v:0.1,a:0.1,d:0.5,s:0.5,r:0.08,},{ ...defaults, w:"sine",v:1,d:0.1,s:4,output:1,}];
export const doorOpening4 = [{...defaults, w:"sawtooth",v:0.4,a:0.1,d:1,p:2,q:1.5,},{...defaults, output:1,w:"n1",v:0.8,f:11,d:11,s:0.2,}];
export const hideSound = [{...defaults, w:"n0",v:0.2,a:0.05,h:0.02,d:0.02,r:0.02,}];
export const flashlightSound = [{...defaults, w:"n0",p:0,r:0.01,h:0,v:0.3,}];
export const elevatorDoor1 = [{...defaults, w:"sine",f:1651,v:0.15,d:0.5,r:0.2,h:0,t:0,},{...defaults, w:"sawtooth",output:1,t:1.21,v:7.2,d:0.1,r:11,h:1,},{...defaults, output:1,w:"n0",v:3.1,t:0.152,d:0.002,r:0.002,}];
export const elevatorMotionRev1 = [{...defaults, w:"sine",t:0,f:100,a:0.2,d:1,r:2,s:1,q:7,},{...defaults, output:1,w:"n1",v:0.7,t:0.9,d:1,s:1,r:1.5,f:40,}];
export const baseDrum = [{...defaults, w:"triangle",t:0,f:88,v:1,d:0.05,h:0.03,p:0.5,q:0.1,},{...defaults, w:"n0",output:1,t:5,v:42,r:0.01,h:0,p:0,}];
export const elevatorDoorTest = [{...defaults, w:"sine",t:0,f:90,v:1,d:1,h:0.5,p:0.5,q:0.5,a:1,s:0.5,r:1,},{...defaults, w:"n0",output:1,t:5,v:3.6,r:1,h:0.5,p:0,f:40,a:1,d:0.75,s:0.5,}]

export const song = expandSong('2P(322P*322P,322P.322Q0322P2322P4322Q6322R8322R:322R<322R>322S@322RB322RD322SF322MH322MJ322ML322MN322NP322MR322MT322NV3235(B<32(B<3/(B<3/8B<3,8B<3)8B<36HB<33HB<30HB<');

export function expandSong(noteString: string) {
  const notesets = noteString.match(/.{5}/g);
  return notesets.map(noteset => ([noteset.charCodeAt(0) - 50, noteset.charCodeAt(1), (noteset.charCodeAt(2) - 40) / 8, (noteset.charCodeAt(3) - 50) / 8, (noteset.charCodeAt(4) - 20)]));
}
