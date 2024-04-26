const randomBoolElement = document.getElementById("random");
const randomMethodElement = document.getElementById("random-method");
const randomAnimationElement = document.getElementById("random-anim");
const randomAnimationTimeElement = document.getElementById("random-time");

document.addEventListener("DOMContentLoaded", init, { once: true });

let inter = setTimeout(saveOptions, 10);
const form = document.getElementById("params");

async function init() {
  // load
  setPageSettings(await LBPlus.getSettings());

  // auto save on update
  document.querySelector("form").addEventListener("submit", submitOptions);
  form.addEventListener("click", function () {
    clearTimeout(inter);
    inter = setTimeout(saveOptions, 10);
  });
}

function getPageSettings() {
  const s = new LBPSettings();
  s.random = Boolean(randomBoolElement.checked);
  s.randomMethod = randomMethodElement.value;
  s.randomAnimation = randomAnimationElement.value;
  s.randomAnimationTime = Number(randomAnimationTimeElement.value);
  return s;
}

function setPageSettings(settings) {
  setCheckBox(randomBoolElement, settings.random);
  randomMethodElement.value = settings.randomMethod;
  randomAnimationElement.value = settings.randomAnimation;
  randomAnimationTimeElement.value = settings.randomAnimationTime;
}

function setCheckBox(button, value) {
  button.value = value;
  button.checked = value;
}

function submitOptions(e) {
  e.preventDefault();
  saveOptions();
}

function saveOptions() {
  const s = getPageSettings();
  // console.log(s)
  LBPlus.setSettings(s);
}
