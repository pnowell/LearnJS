import { onDocReady, startUpdateLoop, optimizeCanvasScale } from '/LearnJS/common/common.js';
import { V2 } from '/LearnJS/common/v2.js';
import { randomIntInRange, randomListIndex } from '/LearnJS/common/utils.js';

const fontFamily = 'KanjiFont';

let canvas;
let ctx;
let levelSelect;
let componentSelect;
let answers;
let fontReady = false;
let db = null;

let dbIndex = 0;
let answerComponent = 'meaning';
let answerButtonCount = 8;
let answered = false;
let buttons = [];
let correctAnswer;
let correctIndex;

onDocReady(function() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  levelSelect = document.getElementById('levelSelect');
  componentSelect = document.getElementById('componentSelect');
  answers = document.getElementById('answers');

  levelSelect.addEventListener('change', loadSelectedLevel);
  componentSelect.addEventListener('change', pickRandomCard);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mouseup", onMouseUp);

  optimizeCanvasScale(canvas);
  startUpdateLoop(onUpdate);

  loadSelectedLevel();
  loadFont();
});

async function loadFont() {
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
}

function getFont(fontSize, fallback) {
  if (fallback) {
    return fontSize + 'px sans-serif';
  } else {
    return fontSize + 'px "' + fontFamily + '"';
  }
}

function measureAndSetFont(fallback) {
  let fontSize = 10;
  ctx.font = getFont(fontSize, fallback);
  let kanji = db[dbIndex].kanji;
  let measure = ctx.measureText(kanji);
  let width = measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight;
  if (!fallback && width == 0) {
    measureAndSetFont(/* fallback= */ true);
  } else {
    let height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
    let maxDim = Math.max(width, height);
    fontSize *= Math.floor(380 / maxDim);
    ctx.font = getFont(fontSize, fallback);
  }
}

function createButton(text) {
  let button = document.createElement('button');
  button.innerHTML = text;
  button.className = 'answer';
  answers.appendChild(button);
  return button;
}

function setDbIndex(index) {
  dbIndex = index;

  // Decide on the set of answers to show
  console.dir(db[dbIndex]);
  let answerList = db[dbIndex][answerComponent];
  if (answerList.length == 0) {
    let newIndex = index + 1;
    if (newIndex >= db.length) newIndex = 0;
    return setDbIndex(newIndex);
  }
  correctAnswer = answerList[randomListIndex(answerList)];

  // Reset the answer buttons
  answers.textContent = '';
  buttons = [];
  let buttonTexts = [];

  //let wrongAnswers = [];
  correctIndex = randomIntInRange(0, answerButtonCount);
  buttonTexts[correctIndex] = correctAnswer;
  for (let i = 0; i < answerButtonCount; i++) {
    if (i == correctIndex) continue;
    // Pick another random db entry
    let text = null;
    do {
      let otherIndex = randomListIndex(db);
      if (otherIndex == dbIndex) continue;
      let otherAnswerList = db[otherIndex][answerComponent];
      if (otherAnswerList.length == 0) continue;
      let otherAnswerIndex = randomListIndex(otherAnswerList)
      text = otherAnswerList[otherAnswerIndex];
    } while(!text || buttonTexts.includes(text) || answerList.includes(text));
    buttonTexts[i] = text;
  }
  for (let i = 0; i < answerButtonCount; i++) {
    let button = createButton(buttonTexts[i]);
    buttons[i] = button;
    const correct = i == correctIndex;
    button.addEventListener("click", e => {
      if (answered) return;
      buttons[correctIndex].className += ' correct-answer';
      if (correct) {
      } else {
        button.className += ' incorrect-answer';
      }
      answered = true;
    });
  }

  answered = false;
}

function onUpdate(dt) {
  if (!fontReady || !db) return true;

  ctx.clearOptimized();

  measureAndSetFont(/* fallback= */ false);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let kanji = db[dbIndex].kanji;
  ctx.fillText(kanji, 200, 200);
  return true;
}

async function loadSelectedLevel() {
  // Clear the current database
  db = null;

  let options = levelSelect.options;
  let levelModuleName = './' + options[options.selectedIndex].value;

  // Then trigger the load of the module and set it to mod
  let mod = await import(levelModuleName);
  db = mod.default;
  pickRandomCard();
}

function pickRandomCard() {
  let options = componentSelect.options;
  answerComponent = options[options.selectedIndex].value;

  setDbIndex(randomListIndex(db));
}

function onMouseDown(e) {
  if (!answered) return;
  pickRandomCard();
}

function onMouseMove(e) {
}

function onMouseUp(e) {
}