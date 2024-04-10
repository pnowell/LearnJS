import { onDocReady, animationLoopWrapper, diagonalToVerticalFov, toDeg, toRad } from '/LearnJS/common/common.js';
import { TweakConfig, Tweaks } from '/LearnJS/common/tweaks.js';

import * as THREE from 'https://unpkg.com/three/build/three.module.js'
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js?module'

let renderer, renderer2d, canvas, canvas2d, scene, scene2d, camera, camera2d, controls;
let tweaks;
let pottery = null;
let pattern = null;
const dfov = 40.0;
const paperWidth = 27.94;
const paperHeight = 21.59;
const holeRadiusL = 0.5;
const holeRadiusM = 0.35;
const holeRadiusS = 0.25;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas2d = document.getElementById('canvas2d');
  canvas2d.style.width = "100%";
  canvas2d.style.height = "100%";

  document.getElementById('savePatternButton')
    .addEventListener('click', savePattern);

  tweaks = new Tweaks(
      {
        'potteryRadius': new TweakConfig('float', (t, isInit) => {
          t.patternWidth = t.potteryRadius * Math.PI * 2;
          if (!isInit) {
            updateCamera2D(false);
          }
        }),
        'potteryHeight': new TweakConfig('float', (t, isInit) => {
          if (!isInit) {
            controls.target = new THREE.Vector3(0, t.potteryHeight / 2, 0);
            updateCamera2D(false);
          }
        }),
        'potteryThickness': new TweakConfig('float'),
        'numSpirals': new TweakConfig('int'),
        'numPointsS': new TweakConfig('float'),
        'numPointsM': new TweakConfig('float'),
        'numPointsL': new TweakConfig('float'),
        'spiralSize': new TweakConfig('float'),
        'spiralArcAngle': new TweakConfig('float'),
        'spiralRotation': new TweakConfig('float'),
        'spiralXOffset': new TweakConfig('float'),
        'spiralYOffset': new TweakConfig('float'),
      },
      () => initGeometry());

  camera = new THREE.PerspectiveCamera(10, 1, 0.1, 350);
  camera.position.set(70, 70, 70);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({canvas: canvas});
  renderer.setAnimationLoop(animationLoopWrapper(animation));
  renderer.setPixelRatio(window.devicePixelRatio);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 3.5;
  controls.maxDistance = 210;
  controls.target = new THREE.Vector3(0, tweaks.potteryHeight / 2, 0);

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

  let boundWidth = Math.max(tweaks.patternWidth, paperWidth) + 0.5;
  let boundHeight = Math.max(tweaks.potteryHeight, paperHeight) + 0.5;

  let canvasAspect = canvasWidth / canvasHeight;
  let patternAspect = boundWidth / boundHeight;

  let camWidth = boundWidth;
  let camHeight = boundHeight;

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
  points.push(
    new THREE.Vector2(0.0, 0.0));
  points.push(
    new THREE.Vector2(tweaks.potteryRadius - tweaks.potteryThickness / 2, 0.0));
  points.push(
    new THREE.Vector2(tweaks.potteryRadius, tweaks.potteryThickness / 2));
  points.push(
    new THREE.Vector2(
      tweaks.potteryRadius,
      tweaks.potteryHeight - tweaks.potteryThickness / 2));
  points.push(
    new THREE.Vector2(
      tweaks.potteryRadius - tweaks.potteryThickness / 2,
      tweaks.potteryHeight));
  points.push(
    new THREE.Vector2(
      tweaks.potteryRadius - tweaks.potteryThickness,
      tweaks.potteryHeight - tweaks.potteryThickness / 2));
  points.push(
    new THREE.Vector2(
      tweaks.potteryRadius - tweaks.potteryThickness,
      tweaks.potteryThickness));
  points.push(
    new THREE.Vector2(0.0, tweaks.potteryThickness));
  const geometry = new THREE.LatheGeometry(points, 30);
  const material = new THREE.MeshPhongMaterial({
    color: 0xccccff,
    flatShading: false,
  });
  return new THREE.Mesh(geometry, material);
}

function createRectModel(x, y, width, height, color) {
  const material = new THREE.LineBasicMaterial({color: color});

  const points = [];
  points.push(new THREE.Vector3(x, y, 0));
  points.push(new THREE.Vector3(x + width, y, 0));
  points.push(new THREE.Vector3(x + width, y + height, 0));
  points.push(new THREE.Vector3(x, y + height, 0));
  points.push(new THREE.Vector3(x, y, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  return new THREE.Line(geometry, material);
}

function createPattern() {
  let patternModel = createRectModel(
    -tweaks.patternWidth / 2,
    -tweaks.potteryHeight / 2,
    tweaks.patternWidth,
    tweaks.potteryHeight,
    0x0000ff
  );

  patternModel.add(
    createRectModel(
      -paperWidth / 2,
      -paperHeight / 2,
      paperWidth,
      paperHeight,
      0xff0000
    )
  );

  return patternModel;
}

function addInstance(geometry, material, x, y) {
  let midRadius = tweaks.potteryRadius - tweaks.potteryThickness / 2;
  const angle = x * 2 * Math.PI / tweaks.patternWidth;
  let potteryY = y + 0.5 * tweaks.potteryHeight;

  if (x < (-tweaks.patternWidth / 2 + 1.0)
      || (tweaks.patternWidth / 2 - 1.0) < x
      || potteryY < tweaks.potteryThickness
      || tweaks.potteryHeight - tweaks.potteryThickness < potteryY) {
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

  const holeGeometryS = new THREE.CylinderGeometry(
    /* radiusTop= */ holeRadiusS,
    /* radiusBottom= */ holeRadiusS,
    /* height= */ tweaks.potteryThickness * 1.1,
    /* radialSegments= */ 15,
    /* heightSegments= */ 1
  );
  const holeGeometryM = new THREE.CylinderGeometry(
    /* radiusTop= */ holeRadiusM,
    /* radiusBottom= */ holeRadiusM,
    /* height= */ tweaks.potteryThickness * 1.1,
    /* radialSegments= */ 15,
    /* heightSegments= */ 1
  );
  const holeGeometryL = new THREE.CylinderGeometry(
    /* radiusTop= */ holeRadiusL,
    /* radiusBottom= */ holeRadiusL,
    /* height= */ tweaks.potteryThickness * 1.1,
    /* radialSegments= */ 15,
    /* heightSegments= */ 1
  );
  const holeMaterial = new THREE.MeshPhongMaterial({
    color: 0x000000,
    flatShading: true,
  });

  let startHoleRadius = 0.0;
  if (tweaks.numPointsS > 0) {
    startHoleRadius = holeRadiusS;
  } else if (tweaks.numPointsM > 0) {
    startHoleRadius = holeRadiusM;
  } else if (tweaks.numPointsL > 0) {
    startHoleRadius = holeRadiusL;
  }

  let spiralStartRadius = tweaks.numSpirals * startHoleRadius * 2.0 / Math.PI;
  let spiralRadius = tweaks.potteryHeight * 0.45 * tweaks.spiralSize;
  const numPoints = tweaks.numPointsS + tweaks.numPointsM + tweaks.numPointsL;
  // Create all the holes
  for (let spiral = 0; spiral < tweaks.numSpirals; spiral++) {
    let spiralStartAngle = 2 * Math.PI * spiral / tweaks.numSpirals + tweaks.spiralRotation;
    for (let point = 0; point < numPoints; point++) {
      let param = point / numPoints;
      let spiralCurrRadius = spiralStartRadius * (1 - param) + spiralRadius * param;
      let spiralCurrAngle = spiralStartAngle + tweaks.spiralArcAngle * param;
      let x = spiralCurrRadius * Math.cos(spiralCurrAngle);
      let y = spiralCurrRadius * Math.sin(spiralCurrAngle);
      x -= tweaks.patternWidth * tweaks.spiralXOffset;
      y += tweaks.potteryHeight * tweaks.spiralYOffset;
      if (point < tweaks.numPointsS) {
        addInstance(holeGeometryS, holeMaterial, x, y);
      } else if (point < tweaks.numPointsS + tweaks.numPointsM) {
        addInstance(holeGeometryM, holeMaterial, x, y);
      } else {
        addInstance(holeGeometryL, holeMaterial, x, y);
      }
    }
  }
}