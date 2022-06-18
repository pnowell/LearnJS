import { onDocReady, diagonalToVerticalFov, toDeg, toRad } from '/LearnJS/common/common.js';
import * as THREE from 'https://unpkg.com/three/build/three.module.js'

let canvas;
let camera;
let dfov = 70;
let scene;
let mesh;
let renderer;

onDocReady(function() {
  canvas = document.getElementById('canvas');

  let fovInput = document.getElementById('fov');
  dfov = fovInput.value;
  fovInput.addEventListener('input', function(e) {
    dfov = e.target.value;
    updateAspectAndFov();
  });

  let aspect = canvas.clientWidth / canvas.clientHeight;
  camera = new THREE.PerspectiveCamera(
    toDeg(diagonalToVerticalFov(toRad(dfov), aspect), aspect, 0.01, 10 ));
  camera.position.z = 1;

  scene = new THREE.Scene();

  const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  const material = new THREE.MeshNormalMaterial();

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize( canvas.clientWidth, canvas.clientHeight );
  renderer.setAnimationLoop( animation );
  canvas.style.width = "100%";
  canvas.style.height = "100%";

  let resizeObserver = new ResizeObserver(updateAspectAndFov);
  resizeObserver.observe(canvas);
});

function updateAspectAndFov() {
  // look up the size the canvas is being displayed
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // you must pass false here or three.js sadly fights the browser
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.fov = toDeg(diagonalToVerticalFov(toRad(dfov), camera.aspect));
  camera.updateProjectionMatrix();
}

// animation
function animation( dt ) {
  mesh.rotation.x = dt / 2000;
  mesh.rotation.y = dt / 1000;

  renderer.render( scene, camera );
}