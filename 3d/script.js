import { onDocReady, animationLoopWrapper, diagonalToVerticalFov, toDeg, toRad } from '/LearnJS/common/common.js';
import fragmentShaderSource from './fragmentShader.js';
import vertexShaderSource from './vertexShader.js';

import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js?module'

let renderer, canvas, scene, camera, dfov, controls, particles;
let param = 0;
const pointer = new THREE.Vector2();
const particleCountX = 21;
const particleCountZ = 21;
const numParticles = particleCountX * particleCountZ;
const separation = 0.5;
const amplitude = 1;
const xWavelength = 5;
const zWavelength = 7;
const xCyclesPerSecond = 3;
const zCyclesPerSecond = 4;

onDocReady(function() {
  canvas = document.getElementById('canvas');

  let fovInput = document.getElementById('fov');
  dfov = fovInput.value;
  fovInput.addEventListener('input', e => {
    dfov = e.target.value;
    updateAspectAndFov(false);
  });

  camera = new THREE.PerspectiveCamera(10, 1, 0.1, 50 );
  camera.position.set(10, 10, 10);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setAnimationLoop(animationLoopWrapper(animation));
  renderer.setPixelRatio(window.devicePixelRatio);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 0.5;
  controls.maxDistance = 30;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene.add(new THREE.GridHelper(10, 20));
  scene.add(new THREE.AxesHelper(3));

  initParticles();

  canvas.style.width = "100%";
  canvas.style.height = "100%";
  let resizeObserver = new ResizeObserver(() => updateAspectAndFov(true));
  resizeObserver.observe(canvas);
  updateAspectAndFov(true);

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
});

function updateAspectAndFov(setRendererSize) {
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // you must pass false here or three.js sadly fights the browser
  if (setRendererSize) {
    renderer.setSize(width, height, false);
  }
  camera.aspect = width / height;
  camera.fov = toDeg(diagonalToVerticalFov(toRad(dfov), camera.aspect));
  camera.updateProjectionMatrix();
}

function updatePointer(e) {
  pointer.x = (event.offsetX / canvas.innerWidth) * 2 - 1;
  pointer.y = -(event.offsetY / canvas.innerWidth) * 2 - 1;
}

let mouseIsDown = false;
function onMouseDown(e) {
  mouseIsDown = true;
  updatePointer(e);
//   controls.enabled = false;
}

function onMouseMove(e) {
  updatePointer(e);
}

function onMouseUp(e) {
  updatePointer(e);
  mouseIsDown = false;
//   controls.enabled = true;
}

// animation
function animation(dt) {
  controls.update();
  updateParticles(dt);
  renderer.render(scene, camera);
}

function initParticles() {
  const positions = new Float32Array( numParticles * 3 );
  const scales = new Float32Array( numParticles );

  let i = 0, j = 0;

  // (particleCount? - 1) * separation should be centered at 0
  // So it should start at (particleCount? - 1) * separation * 0.5
  let minX = -(particleCountX - 1) * separation * 0.5;
  let minZ = -(particleCountZ - 1) * separation * 0.5;
  for (let ix = 0; ix < particleCountX; ix++) {
    for (let iz = 0; iz < particleCountZ; iz++) {
      positions[i] = minX + ix * separation; // x
      positions[i + 1] = 0; // y
      positions[i + 2] = minZ + iz * separation; // z

      scales[j] = 1;

      i += 3;
      j++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute( scales, 1));
  const material = new THREE.ShaderMaterial( {
    uniforms: {
      color: { value: new THREE.Color( 0x000000 ) },
    },
    vertexShader: vertexShaderSource,
    fragmentShader: fragmentShaderSource
  } );
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function updateParticles(dt) {
  const positions = particles.geometry.attributes.position.array;
  const scales = particles.geometry.attributes.scale.array;

  let i = 0, j = 0;

  for (let ix = 0; ix < particleCountX; ix++) {
    for (let iz = 0; iz < particleCountZ; iz++) {
      let x = positions[i];
      let z = positions[i + 2];

      let xPhase = x / xWavelength * Math.PI * 2;
      let zPhase = z / zWavelength * Math.PI * 2;
      let wave = 0.5 * (
        Math.sin(xPhase + param / xCyclesPerSecond)
        + Math.sin(zPhase + param / zCyclesPerSecond));

      positions[i + 1] = amplitude * wave + amplitude;

      scales[j] = wave + 1.5;

      i += 3;
      j++;
    }
  }

  particles.geometry.attributes.position.needsUpdate = true;
  particles.geometry.attributes.scale.needsUpdate = true;

  param += dt * Math.PI * 2;
}