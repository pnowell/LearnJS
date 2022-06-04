export { onDocReady, onUpdate, optimizeCanvasScale };

function onDocReady(fn) {
  document.addEventListener('DOMContentLoaded', fn);
}

function onUpdate(fn) {
  let prevTime = performance.now();

  requestAnimationFrame(function callUpdateFunction(currTime) {
    let dt = currTime - prevTime;
    prevTime = currTime;
    if (fn(dt)) {
      requestAnimationFrame(callUpdateFunction);
    }
  });
}

function optimizeCanvasScale(canvas) {
  let ctx = canvas.getContext('2d');
  if (!('originalWidth' in canvas)) {
    canvas.originalWidth = canvas.width;
  }
  if (!('originalHeight' in canvas)) {
    canvas.originalHeight = canvas.height;
  }
  let canvasAspect = canvas.originalWidth / canvas.originalHeight;
  let clientAspect = canvas.clientWidth / canvas.clientHeight;
  let scale = Math.min(
    canvas.clientWidth / canvas.originalWidth,
    canvas.clientHeight / canvas.originalHeight);
  if (canvasAspect > clientAspect) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.width / canvasAspect;
  } else {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * canvasAspect;
  }
  ctx.scale(scale, scale);
}