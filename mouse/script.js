import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';

const gravity = -50;
let canvas;
let ctx;
let particles = [];

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  optimizeCanvasScale(canvas);
  startUpdateLoop(onUpdate);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  canvas.addEventListener("mousemove", onMouseMove);
});

let mouseIsDown = false;
function onMouseDown(e) {
  mouseIsDown = true;
}

function onMouseUp(e) {
  mouseIsDown = false;
}

function onMouseMove(e) {
  if (mouseIsDown) {
    particles.push({
      pos: ctx.getMousePos(e),
      vel: {x: 0, y: 0},
      startTime: performance.now()
    });
  }
}

function onUpdate(dt) {
  // Update particles
  let time = performance.now();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    if (time - p.startTime > 5000) {
      particles.splice(i, 1);
      continue;
    }

    p.vel.y += dt * gravity;
    p.pos.y -= dt * p.vel.y;
  }

  // Draw the particles
  ctx.clearOptimized();

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    ctx.fillRect(p.pos.x, p.pos.y, 1, 1);
  }

  return true;
}


/*
isTrusted: true
altKey: false
bubbles: true
button: 0
buttons: 1
cancelBubble: false
cancelable: true
clientX: 91
clientY: 118
composed: true
ctrlKey: false
currentTarget: null
defaultPrevented: false
detail: 0
eventPhase: 0
fromElement: null
layerX: 91
layerY: 118
metaKey: false
movementX: 0
movementY: -1
offsetX: 82
offsetY: 109
pageX: 91
pageY: 118
path: (6) [canvas#canvas, div.container, body, html, document, Window]
relatedTarget: null
returnValue: true
screenX: 91
screenY: 200
shiftKey: false
sourceCapabilities: InputDeviceCapabilities {firesTouchEvents: false}
srcElement: canvas#canvas
target: canvas#canvas
timeStamp: 3693
toElement: canvas#canvas
type: "mousemove"
view: Window {window: Window, self: Window, document: document, name: 'previewWindow', location: Location, …}
which: 1
x: 91
y: 118
[[Prototype]]: MouseEvent
*/