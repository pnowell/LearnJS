import { onDocReady, animationLoopWrapper, diagonalToVerticalFov, toDeg, toRad } from '/LearnJS/common/common.js';

import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js?module'

let renderer, renderer2d, canvas, canvas2d, scene, scene2d, camera, camera2d, controls;
let potteryHeight, potteryRadius, potteryThickness, patternWidth;
let numSpirals, numPoints, spiralSize, spiralArcAngle, spiralXOffset, spiralYOffset;
let param = 0;
let pottery = null;
let pattern = null;
const dfov = 40.0;
const paperWidth = 27.94;
const paperHeight = 21.59;
const holeRadiusL = 0.35;
const holeRadiusM = 0.25;
const holeRadiusS = 0.2;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas2d = document.getElementById('canvas2d');
  canvas2d.style.width = "100%";
  canvas2d.style.height = "100%";

  document.getElementById('savePatternButton')
    .addEventListener('click', savePattern);

  let heightInput = document.getElementById('heightSlider');
  potteryHeight = parseFloat(heightInput.value);
  heightInput.addEventListener('input', e => {
    potteryHeight = parseFloat(e.target.value);
    controls.target = new THREE.Vector3(0, potteryHeight / 2, 0);
    updateCamera2D(false);
    initGeometry();
  });

  let radiusInput = document.getElementById('radiusSlider');
  potteryRadius = parseFloat(radiusInput.value);
  patternWidth = potteryRadius * Math.PI * 2;
  radiusInput.addEventListener('input', e => {
    potteryRadius = parseFloat(e.target.value);
    patternWidth = potteryRadius * Math.PI * 2;
    updateCamera2D(false);
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

  camera = new THREE.PerspectiveCamera(10, 1, 0.1, 350);
  camera.position.set(70, 70, 70);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setAnimationLoop(animationLoopWrapper(animation));
  renderer.setPixelRatio(window.devicePixelRatio);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 3.5;
  controls.maxDistance = 210;
  controls.target = new THREE.Vector3(0, potteryHeight / 2, 0);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  scene.add(new THREE.GridHelper(60, 12));
  scene.add(new THREE.AxesHelper(30));
  scene.add(new THREE.HemisphereLight(0xbbbbbb, 0x777777, 3));
  let dirLight = new THREE.DirectionalLight(0xbbbbbb, 3);
  dirLight.position.set(0, 0, 0);
  dirLight.target.position.set(-1, 0, -2);
  scene.add(dirLight);
  scene.add(dirLight.target);

  camera2d = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 350);
  camera2d.position.set(0, 0, -70);
  camera2d.lookAt(0, 0, 0);
  
  renderer2d = new THREE.WebGLRenderer({canvas: canvas2d});
  renderer2d.setPixelRatio(window.devicePixelRatio);

  scene2d = new THREE.Scene();
  scene2d.background = new THREE.Color(0xffffff);
  scene2d.add(new THREE.AmbientLight(0xffffff, 1));

  let resizeObserver = new ResizeObserver(() => updateCameras(true));
  resizeObserver.observe(canvas);
  updateCameras(true);

  initGeometry();

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);
});

function updateCameras(setRenderSize) {
  updateCamera3D(setRenderSize);
  updateCamera2D(setRenderSize);
}

function updateCamera3D(setRendererSize) {
  // look up the size the canvas is being displayed
  const canvasWidth = canvas.clientWidth;
  const canvasHeight = canvas.clientHeight;

  // you must pass false here or three.js sadly fights the browser
  if (setRendererSize) {
    renderer.setSize(canvasWidth, canvasHeight, false);
  }
  camera.aspect = canvasWidth / canvasHeight;
  camera.fov = toDeg(diagonalToVerticalFov(toRad(dfov), camera.aspect));
  camera.updateProjectionMatrix();
}

function updateCamera2D(setRendererSize) {
  const canvasWidth = canvas2d.clientWidth;
  const canvasHeight = canvas2d.clientHeight;

  if (setRendererSize) {
    renderer2d.setSize(canvasWidth, canvasHeight, false);
  }

  let canvasAspect = canvasWidth / canvasHeight;
  let patternAspect = patternWidth / potteryHeight;

  let camWidth = patternWidth;
  let camHeight = potteryHeight;

  if (canvasAspect < patternAspect) {
    camHeight = camWidth / canvasAspect;
  } else {
    camWidth = camHeight * canvasAspect;
  }

  camera2d.position.set(0, 0, -10);
  camera2d.lookAt(0, 0, 0);
  camera2d.left = -camWidth / 2;
  camera2d.right = camWidth / 2;
  camera2d.bottom = -camHeight / 2;
  camera2d.top = camHeight / 2;
  camera2d.updateProjectionMatrix();
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
  renderer.render(scene, camera);
  renderer2d.render(scene2d, camera2d);
}

function savePattern() {
  alert('Saving pattern...');
}

function createPottery() {
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
  return new THREE.Mesh(geometry, material);
}

function createPattern() {
  const material = new THREE.LineBasicMaterial({color: 0x0000ff});

  const points = [];
  points.push(new THREE.Vector3(-patternWidth / 2, -potteryHeight / 2, 0));
  points.push(new THREE.Vector3(patternWidth / 2, -potteryHeight / 2, 0));
  points.push(new THREE.Vector3(patternWidth / 2, potteryHeight / 2, 0));
  points.push(new THREE.Vector3(-patternWidth / 2, potteryHeight / 2, 0));
  points.push(new THREE.Vector3(-patternWidth / 2, -potteryHeight / 2, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return new THREE.Line(geometry, material);
}

function addInstance(geometry, material, x, y) {
  let midRadius = potteryRadius - potteryThickness / 2;
  const angle = x * 2 * Math.PI / patternWidth;
  let potteryY = y + 0.5 * potteryHeight;

  if (x < (-patternWidth / 2 + 0.5)
      || (patternWidth / 2 - 0.5) < x
      || potteryY < potteryThickness
      || potteryHeight - potteryThickness < potteryY) {
    return;
  }

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    Math.cos(angle) * midRadius,
    potteryY,
    Math.sin(angle) * midRadius
  );
  mesh.rotateOnAxis(
    new THREE.Vector3(
      Math.sin(angle),
      0.0,
      -Math.cos(angle)
    ),
    Math.PI / 2
  );
  pottery.add(mesh);

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, y, 0.0);
  mesh.rotateOnAxis(new THREE.Vector3(1.0, 0.0, 0.0), Math.PI / 2);
  pattern.add(mesh);
}

function initGeometry() {
  if (pottery) {
    pottery.removeFromParent();
    pottery = null;
  }
  if (pattern) {
    pattern.removeFromParent();
    pattern = null;
  }

  pottery = createPottery();
  scene.add(pottery);

  pattern = createPattern();
  scene2d.add(pattern);

  const holeGeometry = new THREE.CylinderGeometry(
    /* radiusTop= */ holeRadiusM,
    /* radiusBottom= */ holeRadiusM,
    /* height= */ potteryThickness * 1.1,
    /* radialSegments= */ 15,
    /* heightSegments= */ 1
  );
  const holeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    flatShading: true,
  });

  let spiralRadius = potteryHeight * 0.45 * spiralSize;
  // Create all the holes
  for (let spiral = 0; spiral < numSpirals; spiral++) {
    let spiralStartAngle = 2 * Math.PI * spiral / numSpirals;
    for (let point = 0; point < numPoints; point++) {
      let param = point / numPoints;
      let spiralCurrRadius = spiralRadius * param;
      let spiralCurrAngle = spiralStartAngle + spiralArcAngle * param;
      let x = spiralCurrRadius * Math.cos(spiralCurrAngle);
      let y = spiralCurrRadius * Math.sin(spiralCurrAngle);
      x -= patternWidth * spiralXOffset;
      y += potteryHeight * spiralYOffset;
      addInstance(holeGeometry, holeMaterial, x, y);
    }
  }
}