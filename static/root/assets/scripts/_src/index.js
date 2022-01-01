import * as THREE from 'three';

import { createGround } from './ground';
import { createLights } from './lights';
import { createControls } from './controls';
import { createRenderer } from './renderer';
import { createCamera } from './camera';
import { createScene } from './scene';
import { createTrees } from './tree';
import { random } from 'canvas-sketch-util';
import { createSnowfall } from './snowfall';
import { createComposer } from './composer';

const randomInstance = random.createRandom();
randomInstance.setSeed('996048');

const ctx = {
  options: {
    atmosphereColor: new THREE.Color('hsl(0, 0%, 5%)'),
    squareSize: 50,
    treesPerSquare: 500,
    snowfallParticlesCount: 100000,
  },
  lights: {},
  objects: {},
  randomInstance,
};

const canvas = document.querySelector('#canvas');
ctx.canvas = canvas;

createScene(ctx);
createCamera(ctx);
createRenderer(ctx);
createControls(ctx);
createLights(ctx);
createGround(ctx);
createTrees(ctx);
createSnowfall(ctx);
// createComposer(ctx);

function resize() {
  if (window.prevWidth !== window.innerWidth || window.prevHeight !== window.innerHeight) {
    window.prevWidth = window.innerWidth;
    window.prevHeight = window.innerHeight;

    ctx.camera.aspect = window.innerWidth / window.innerHeight;
    ctx.camera.updateProjectionMatrix();

    ctx.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

let prevTime = 0;
function animate(time) {
  const diffTime = (time || 0) - prevTime;
  prevTime = time || 0;

  resize();

  if (ctx.objects.snowfall) {
    const snowfallMaterial = ctx.objects.snowfall.material;
    snowfallMaterial.uniforms.iTime.value = time * 0.001 * 0.175;
    snowfallMaterial.uniforms.camPosition = new THREE.Uniform(ctx.camera.position);
  }

  // ctx.camera.position.x -= diffTime * 0.001;

  ctx.renderer.render(ctx.scene, ctx.camera);
  // ctx.renderer.render(ctx.pScene, ctx.pCamera);
  // ctx.composer.render();


  requestAnimationFrame(animate);
}

animate();
