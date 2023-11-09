class Settings{
	constructor(){
		this.random = true;
		this.randomMethod = "fast";
		this.randomAnimation = "spin";
		this.randomAnimationTime = 2;
	}
}

const randomBoolElement = document.getElementById("rb");
const randomMethodElement = document.getElementById("rm");
const randomAnimationElement = document.getElementById("ra");
const randomAnimationTimeElement = document.getElementById("rt");


async function init(){
	setPageSettings(await getStorage());
}

function getPageSettings(){
	const s = new Settings;

	s.random = Boolean(randomBoolElement.checked);
	s.randomMethod = randomMethodElement.value;
	s.randomAnimation = randomAnimationElement.value;
	s.randomAnimationTime = Number(randomAnimationTimeElement.value)
	return s
}

function setPageSettings(s){
	setCheckBox(randomBoolElement, s.random);
	randomMethodElement.value = s.randomMethod;
	randomAnimationElement.value = s.randomAnimation;
	randomAnimationTimeElement.value = s.randomAnimationTime;
}

function setCheckBox(button, value){
	button.value = value;
	button.checked = value;
}

async function submitOptions(e) {
	e.preventDefault();
	saveOptions()
}

async function saveOptions() {
	let s = getPageSettings();
	console.log(s)
	setStorage(s);
}

async function getStorage() {
	let s = new Settings();
	await browser.storage.local.get("settings").then(
		async (e) => {
			if (!e.settings){
				await setOptions(s);
			}else{
				const ek = Object.keys(e.settings);
				for (const key of ek){
					if (e.settings[key] != undefined)
						s[key] = e.settings[key];
				}
			}
		}
	)
	return s;
}

async function setStorage(settings) {
	await browser.storage.local.set({
		settings: {
			"random": settings.random,
			"randomMethod": settings.randomMethod,
			"randomAnimation": settings.randomAnimation,
			"randomAnimationTime": settings.randomAnimationTime
		}
	})
	//console.debug("set:", settings)
}

document.querySelector("form").addEventListener("submit", submitOptions);


var inter = setTimeout(saveOptions, (10)); 
var form = document.getElementById('params');
form.addEventListener('click',function(){  
  clearTimeout(inter);
  inter = setTimeout(saveOptions, (10));
});

init();