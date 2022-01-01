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

const randomInstance = random.createRandom();
// randomInstance.setSeed('996048');

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

function resize() {
  if (window.prevWidth !== window.innerWidth || window.prevHeight !== window.innerHeight) {
    window.prevWidth = window.innerWidth;
    window.prevHeight = window.innerHeight;

    ctx.camera.aspect = window.innerWidth / window.innerHeight;
    ctx.camera.updateProjectionMatrix();

    ctx.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function animate(time) {
  resize();

  const shaderTime = time * 0.001 * 0.175;

  if (ctx.objects.snowfall) {
    const snowfallMaterial = ctx.objects.snowfall.material;
    snowfallMaterial.uniforms.iTime.value = shaderTime;
    snowfallMaterial.uniforms.camPosition = new THREE.Uniform(ctx.camera.position);
  }

  if (ctx.snowMaterialShader) {
    ctx.snowMaterialShader.uniforms.iTime.value = shaderTime;
  }
  if (ctx.treeSnowMaterialShader) {
    ctx.treeSnowMaterialShader.uniforms.iTime.value = shaderTime;
  }

  ctx.renderer.render(ctx.scene, ctx.camera);

  requestAnimationFrame(animate);
}

animate();
