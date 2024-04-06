import { onDocReady, animationLoopWrapper, diagonalToVerticalFov, toDeg, toRad } from '/LearnJS/common/common.js';

import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js?module'

let renderer, canvas, scene, camera, dfov, controls;
let potteryHeight, potteryRadius, potteryThickness;
let numSpirals, numPoints, spiralSize, spiralArcAngle, spiralXOffset, spiralYOffset;
let param = 0;
let pottery = null;
const separation = 0.5;
const amplitude = 1;
const xWavelength = 5;
const zWavelength = 7;
const xCyclesPerSecond = 3;
const zCyclesPerSecond = 4;

onDocReady(function() {
  canvas = document.getElementById('canvas');

  let fovInput = document.getElementById('fov');
  dfov = parseFloat(fovInput.value);
  fovInput.addEventListener('input', e => {
    dfov = parseFloat(e.target.value);
    updateAspectAndFov(false);
  });

  let heightInput = document.getElementById('heightSlider');
  potteryHeight = parseFloat(heightInput.value);
  heightInput.addEventListener('input', e => {
    potteryHeight = parseFloat(e.target.value);
    controls.target = new THREE.Vector3(0, potteryHeight / 2, 0);
    initGeometry();
  });

  let radiusInput = document.getElementById('radiusSlider');
  potteryRadius = parseFloat(radiusInput.value);
  radiusInput.addEventListener('input', e => {
    potteryRadius = parseFloat(e.target.value);
    initGeometry();
  });

  let thicknessInput = document.getElementById('thicknessSlider');
  potteryThickness = parseFloat(thicknessInput.value);
  thicknessInput.addEventListener('input', e => {
    potteryThickness = parseFloat(e.target.value);
    initGeometry();
  });

  let numSpiralsInput = document.getElementById('numSpiralsSlider');
  numSpirals = parseInt(numSpiralsInput.value);
  numSpiralsInput.addEventListener('input', e => {
    numSpirals = parseInt(e.target.value);
    initGeometry();
  });

  let numPointsInput = document.getElementById('numPointsSlider');
  numPoints = parseInt(numPointsInput.value);
  numPointsInput.addEventListener('input', e => {
    numPoints = parseInt(e.target.value);
    initGeometry();
  });

  let spiralSizeInput = document.getElementById('spiralSizeSlider');
  spiralSize = parseFloat(spiralSizeInput.value);
  spiralSizeInput.addEventListener('input', e => {
    spiralSize = parseFloat(e.target.value);
    initGeometry();
  });

  let spiralArcAngleInput = document.getElementById('spiralArcAngleSlider');
  spiralArcAngle = parseFloat(spiralArcAngleInput.value);
  spiralArcAngleInput.addEventListener('input', e => {
    spiralArcAngle = parseFloat(e.target.value);
    initGeometry();
  });

  let spiralXOffsetInput = document.getElementById('spiralXOffsetSlider');
  spiralXOffset = parseFloat(spiralXOffsetInput.value);
  spiralXOffsetInput.addEventListener('input', e => {
    spiralXOffset = parseFloat(e.target.value);
    initGeometry();
  });

  let spiralYOffsetInput = document.getElementById('spiralYOffsetSlider');
  spiralYOffset = parseFloat(spiralYOffsetInput.value);
  spiralYOffsetInput.addEventListener('input', e => {
    spiralYOffset = parseFloat(e.target.value);
    initGeometry();
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
  controls.target = new THREE.Vector3(0, potteryHeight / 2, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene.add(new THREE.GridHelper(10, 20));
  scene.add(new THREE.AxesHelper(3));
  scene.add(new THREE.HemisphereLight(0xbbbbbb, 0x777777, 3));
  let dirLight = new THREE.DirectionalLight(0xbbbbbb, 3);
  dirLight.position.set(0, 0, 0);
  dirLight.target.position.set(-1, 0, -2);
  scene.add(dirLight);
  scene.add(dirLight.target);

  initGeometry();

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

let mouseIsDown = false;
function onMouseDown(e) {
  mouseIsDown = true;
}

function onMouseMove(e) {
}

function onMouseUp(e) {
  mouseIsDown = false;
}

// animation
function animation(dt) {
  controls.update();
  updateGeometry(dt);
  renderer.render(scene, camera);
}

function initGeometry() {
  if (pottery) {
    pottery.removeFromParent();
    pottery = null;
  }

  const points = [];
  points.push(new THREE.Vector2(0.0, 0.0));
  points.push(new THREE.Vector2(potteryRadius - potteryThickness / 2, 0.0));
  points.push(new THREE.Vector2(potteryRadius, potteryThickness / 2));
  points.push(new THREE.Vector2(potteryRadius, potteryHeight - potteryThickness / 2));
  points.push(new THREE.Vector2(potteryRadius - potteryThickness / 2, potteryHeight));
  points.push(new THREE.Vector2(potteryRadius - potteryThickness, potteryHeight - potteryThickness / 2));
  points.push(new THREE.Vector2(potteryRadius - potteryThickness, potteryThickness));
  points.push(new THREE.Vector2(0.0, potteryThickness));
  const geometry = new THREE.LatheGeometry(points, 30);
  const material = new THREE.MeshPhongMaterial({
    color: 0xccccff,
    flatShading: false,
  });
  pottery = new THREE.Mesh(geometry, material);
  scene.add(pottery);

  const holeGeometry = new THREE.CylinderGeometry(
    /* radiusTop= */ 0.05,
    /* radiusBottom= */ 0.05,
    /* height= */ potteryThickness + 0.01,
    /* radialSegments= */ 15,
    /* heightSegments= */ 1
  );
  const holeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    flatShading: true,
  });

  let spiralRadius = potteryHeight * 0.45 * spiralSize;
  let midRadius = potteryRadius - potteryThickness / 2;
  // Create all the holes
  for (let spiral = 0; spiral < numSpirals; spiral++) {
    let spiralStartAngle = 2 * Math.PI * spiral / numSpirals;
    for (let point = 0; point < numPoints; point++) {
      let param = point / numPoints;
      let spiralCurrRadius = spiralRadius * param;
      let spiralCurrAngle = spiralStartAngle + spiralArcAngle * param;
      let hole = new THREE.Mesh(holeGeometry, holeMaterial);
      let x = spiralCurrRadius * Math.cos(spiralCurrAngle);
      let y = spiralCurrRadius * Math.sin(spiralCurrAngle);
      x = x / potteryRadius - spiralXOffset;
      y += potteryHeight * (0.5 + spiralYOffset);
      if (-Math.PI * 0.9 < x
          && x < Math.PI * 0.9
          && potteryThickness < y
          && y < potteryHeight - potteryThickness) {
        hole.position.set(
          Math.cos(x) * midRadius,
          y,
          Math.sin(x) * midRadius
        );
        hole.rotateOnAxis(
          new THREE.Vector3(
            Math.sin(x),
            0.0,
            -Math.cos(x)
          ),
          Math.PI / 2
        );
        pottery.add(hole);
      }
    }
  }
}

function updateGeometry(dt) {
}