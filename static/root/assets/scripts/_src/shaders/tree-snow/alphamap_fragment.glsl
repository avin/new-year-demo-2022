#include <alphamap_fragment>

// diffuseColor.rgb += vec3(abs(snoise(vec3(vUv*2000., 1.))))*.2;
diffuseColor.rgb += smoothstep(.8,.9, abs(snoise(vec3(vUv*200., 1.)))) *.5;
