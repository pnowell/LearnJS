import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { V2 } from '/LearnJS/common/v2.js';
import db from './data.js';

const fontFamily = 'KanjiFont';

let canvas;
let ctx;
let fontReady = false;
let dbIndex = 0;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  optimizeCanvasScale(canvas);
  startUpdateLoop(onUpdate);

  let font = new FontFace(
    fontFamily,
    'url(/LearnJS/assets/fonts/hkgokukaikk/hkgokukaikk.ttf)');
  font
    .load()
    .then(
      (f) => {
        document.fonts.add(f);
        fontReady = true;
      },
      (err) => {
        throw {type: "font_loading_err", fontName: fontFamily, DOMException: err};
      });
});

function onUpdate(dt) {
  if (!fontReady) return true;

  ctx.clearOptimized();
  let fontSize = 10;
  ctx.font = getFont(fontSize);
  let kanji = db[dbIndex].kanji;
  let measure = ctx.measureText(kanji);
  console.dir(measure);
  let maxDim = Math.max(
      measure.width,
      measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent);
  fontSize *= Math.floor(380 / maxDim);
  ctx.font = getFont(fontSize);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillText(kanji, 200, 200);
  return true;
}

function getFont(fontSize) {
  return fontSize + 'px "' + fontFamily + '"';
}

function onMouseDown(e) {
  dbIndex = (dbIndex + 1) % db.length;
}

function onMouseMove(e) {
}

function onMouseUp(e) {
}