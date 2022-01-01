import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import vertexShader from './shaders/effect/vert.glsl';
import fragmentShader from './shaders/effect/frag.glsl';

import { BokehShader, BokehDepthShader } from 'three/examples/jsm/shaders/BokehShader2.js';

export const createComposer = (ctx) => {
  const { renderer, scene, camera } = ctx;

  // const composer = new EffectComposer(ctx.renderer);
  // ctx.composer = composer;
  // composer.addPass(new RenderPass(ctx.scene, ctx.camera));
  //
  // const effect = new ShaderPass({
  //   uniforms: {
  //     tDiffuse: { value: null },
  //     amount: { value: 0.005 },
  //     angle: { value: 0.0 },
  //     iResolution: new THREE.Uniform(new THREE.Vector2(window.innerWidth, window.innerHeight)),
  //   },
  //   vertexShader,
  //   fragmentShader,
  // });
  // // effect.uniforms['amount'].value = 0.001;
  // composer.addPass(effect);
  //
  // composer.addPass(effect);

  const pScene = new THREE.Scene();

  const pCamera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    -10000,
    10000,
  );
  pCamera.position.z = 100;

  pScene.add(pCamera);

  ctx.pScene = pScene;
  ctx.pCamera = pCamera;

  const pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
  const rtTextureDepth = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);
  const rtTextureColor = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, pars);

  const depthShader = BokehDepthShader;

  const materialDepth = new THREE.ShaderMaterial({
    uniforms: depthShader.uniforms,
    vertexShader: depthShader.vertexShader,
    fragmentShader: depthShader.fragmentShader,
  });

  materialDepth.uniforms['mNear'].value = camera.near;
  materialDepth.uniforms['mFar'].value = camera.far;

  renderer.clear();

  renderer.setRenderTarget(rtTextureColor);
  renderer.clear();
  renderer.render(scene, camera);

  // render depth into texture

  scene.overrideMaterial = materialDepth;
  renderer.setRenderTarget(rtTextureDepth);
  renderer.clear();
  renderer.render(scene, camera);
  scene.overrideMaterial = null;

  // render bokeh composite

  renderer.setRenderTarget(null);
  renderer.render(pScene, pCamera);
};
