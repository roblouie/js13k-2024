const defaults = {g:0,w:"sine",t:1,f:0,v:0.5,a:0,h:0.01,d:0.01,s:0,r:0.05,p:1,q:1,k:0}
export const bassDrum1 = [{ ...defaults, w:"triangle",t:0,f:88,v:1,d:0.05,h:0.03,p:0.5,q:0.1,},{ ...defaults, w:"n0",g:1,t:5,v:42,r:0.01,h:0,p:0,}];

const doorOpenStartingPOint = [{w:"sawtooth",v:0.4,a:1,h:1,s:0.5,},{g:1,w:"triangle",v:0.6,t:0,f:-0.1,a:0.5,h:1,s:1,r:0.01,b:0,c:0,p:-40,q:20,},{g:1,w:"n1",v:0.2,t:0,f:200,a:0.3,h:1,s:1,r:0.01,b:0,c:0,}];
const doorOpening2 = [{w:"sawtooth",v:0.4,r:0,a:1,h:1,s:0.5,},{g:1,w:"triangle",v:0.6,t:0,f:-0.3,a:2,h:1,d:1,s:0.5,r:0.01,b:0,c:0,},{g:1,w:"n0",v:0.05,t:0,f:200,a:0.3,h:1,s:1,r:0.01,b:0,c:0,}]
const doorOpening3 = [{w:"sawtooth",v:0.4,r:0,a:1,h:1,s:0.5,},{g:1,w:"triangle",v:0.6,t:0,f:-0.4,a:2,h:1,d:1,s:0.5,r:0.01,b:0,c:0,p:-1,},{g:1,w:"n0",v:0.08,t:0,f:4,a:0.3,h:1,s:1,r:0.01,b:0,c:0,}];
// POTENTIAL FOOTSTEPS:
// 117 Taiko Drum 38 - 40 alternating


// POTENTIAL CREEPY MUSIC NOTES
// 113 Tinkle Bell - creepy chase / mood music
// 112 Shanai or 111 - base line??
