export { onDocReady, startUpdateLoop, optimizeCanvasScale };

function onDocReady(fn) {
  document.addEventListener('DOMContentLoaded', fn);
}

function startUpdateLoop(fn) {
  let prevTime = performance.now();

  requestAnimationFrame(function callUpdateFunction(currTime) {
    let dt = currTime - prevTime;
    prevTime = currTime;
    if (fn(dt / 1000.0)) {
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
  canvas.scale = Math.min(
    canvas.clientWidth / canvas.originalWidth,
    canvas.clientHeight / canvas.originalHeight);
  if (canvasAspect > clientAspect) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.width / clientAspect;
  } else {
    canvas.height = canvas.clientHeight;
    canvas.width = canvas.height * clientAspect;
  }
  ctx.scale(canvas.scale, canvas.scale);
  ctx.getMousePos = function(e) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - canvas.clientLeft - rect.left) / canvas.scale,
      y: (e.clientY - canvas.clientTop - rect.top) / canvas.scale
    }
  }
  ctx.getMouseMovement = function(e) {
    return {
      x: e.movementX / canvas.scale,
      y: e.movementY / canvas.scale
    };
  }

  canvas.needsReoptimization = false;
  if (!('clearOptimized' in ctx)) {
    window.addEventListener('resize', function() {
      canvas.needsReoptimization = true;
    });
    ctx.clearOptimized = function() {
      if (canvas.needsReoptimization) {
        optimizeCanvasScale(canvas);
      } else {
        ctx.clearRect(0, 0, canvas.width / canvas.scale, canvas.height / canvas.scale);
      }
    }
  }
}