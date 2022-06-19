export {
  onDocReady, startUpdateLoop, animationLoopWrapper, optimizeCanvasScale,
  diagonalToVerticalFov, toDeg, toRad
};

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

function animationLoopWrapper(fn) {
  let prevTime = performance.now();

  return function (currTime) {
    let dt = currTime - prevTime;
    prevTime = currTime;
    fn(dt / 1000.0);
  };
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

function toRad(deg) {
  return deg * Math.PI / 180;
}

function toDeg(rad) {
  return rad * 180 / Math.PI;
}

function diagonalToVerticalFov(dfov, aspect) {
  return 2 * Math.atan(Math.tan(dfov / 2) / Math.sqrt(1 + aspect * aspect));
}