/* 
This code will run ONLY on 
    letterboxd/(username)/list/*
    letterboxd/(username)/watchlist/*
*/

// code quality is getting much worse :)

const MAGIC_WORD = "random"
let button = null;
const animationName = "lootbox";
const fastRandom = false;
const FXtime = 2;

let highlightedCard = null
let zMemory = null
let animId = null;

const style = `
.lpGrid {
	!important;
	height: 100vh;
	flex: auto;
	margin-right: 2em;
	max-width: none !important;
}

.lpGrid > li {
	height: fit-content;
}

.lpGrid > li > div {
	height: 100%;
	width: 100%;
}

.lpHighlight {
	border: 0.5em gray solid;
	box-shadow: 0px 0px 1em 0.5em gray;
	border-radius: 0.5em;
}

.lpSelect {
	border: 0.5em lightblue solid !important;
	box-shadow: 0px 0px 1em 0.5em lightblue !important;
	transform: scale(1.15) !important;
}

.lpFloating {
	transition: none !important;
	height: fit-content;
	position: absolute;
	left: 50%;
	top: 50%;
}
`

init()

function init(){
	addStyle()

	const magicIndex = getMagicWord()
	//console.debug(magicIndex)
	if(magicIndex != null){
			selectMovie(magicIndex)
	}else{
			createRandomButton()
	}
}

function start(){
	if (button.disabled){
		console.debug("button disabled")
		return
	}

	const totalPages = getPagesCount(document);
	if (fastRandom){
		const randomPage = getRandomIntInclusive(1, totalPages);
		goToMovie(randomPage, -1)
	}else{
		const firstPageUrl = getPageUrl(1);
		const paginationSize = getPageSize(firstPageUrl);
		const lastPageUrl = getPageUrl(totalPages);
		const lastPageSize = getPageSize(lastPageUrl);
		
		button.disabled = true;

		Promise.all([paginationSize, lastPageSize]).then( (values) => {
			const totalMoviesCount = values[0] * (totalPages - 1) + values[1];
			const randomMovieIndex = getRandomIntInclusive(1, totalMoviesCount);
			const moviePage = Math.ceil(randomMovieIndex/values[0]);
			const movieIndex = randomMovieIndex%values[0];

			console.debug("pagination =", values[0], "lastPageSize =", values[1], "total:", totalMoviesCount,
											totalPages, "randomIndex:",randomMovieIndex, moviePage, movieIndex);
			button.disabled = false;
			goToMovie(moviePage, movieIndex);
		});
	}
}

function goToMovie(pageNumber, movieIndex){
	const movies = getPageMovies(document);
	if (movieIndex < 1 || movieIndex > movies.length){
		movieIndex = getRandomIntInclusive(1, movies.length)
		console.debug("new Index (goto)", movieIndex)
	}
	console.debug("goToMovie", pageNumber, movieIndex)

	const movieUrl = getPageUrl(pageNumber);
	if (movieUrl){
			const url  = [movieUrl, "?", MAGIC_WORD, "=", movieIndex].join("");
			document.location.href = url;
	}else{
			document.search = "";
			document.location.href = "https://letterboxd.com";
	}
}

function selectMovie(index){
	const movies = getPageMovies(document);
	if (index < 1 || index > movies.length){
		index = getRandomIntInclusive(1, movies.length)
		console.debug("new Index", index)
	}

	// for some reason film indexes starts at one.
	const movie = movies[index - 1];

	switch (animationName) {
		case "spin":
			maximizeContent()
			animateCarousel(index - 1)
			break;
		case "lootbox":
			maximizeContent()
			animateLootbox(index - 1)
			break;
		default:
			openMovie(movie)
	}
}

function openMovie(movieElement){
	let url = movieElement.getElementsByClassName("film-poster")[0].getAttribute("data-target-link");
	if (url != null){
			url = "https://letterboxd.com" + url;
	}
	else{
			url = movieElement.getElementsByTagName("a")[0].href;
	}

	if (url){
			document.search = "";
			document.location.href = url;
	}else{
			console.error("failed to get movie url");
	}
}

function getMagicWord(){
	const params = (new URL(document.URL)).searchParams;
	const magicValue = params.get(MAGIC_WORD);
	return magicValue;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
	// The maximum is inclusive and the minimum is inclusive
}

async function getPageSize(url){
	const listPageText = await fetch(url).then((r) => {
			const res = r.text();
			return res;
	});
	const templ = document.createElement("template");
	templ.innerHTML = listPageText;
	const movies = getPageMovies(templ.content)
	//console.debug("pagination =", movies.length)
	return movies.length;
}

function getPageMovies(pageContent){
	const grid = getGrid(pageContent)
	const movies = grid.getElementsByTagName("li")

	return movies;
}

function createRandomButton(){
	const randomButton =  document.createElement("button")
	randomButton.classList = "button clipboardtrigger has-icon"
	randomButton.innerHTML = MAGIC_WORD

	const ButtonSpace = document.createElement("li")
	ButtonSpace.classList.add("panel-signin")
	ButtonSpace.appendChild(randomButton);
	ButtonSpace.onclick = start;


	const PanelUl = document.getElementsByClassName("actions-panel")[0].getElementsByTagName("ul")[0];
	const InsertTarget = PanelUl.getElementsByTagName("li")[0];
	button =  PanelUl.insertBefore(ButtonSpace, InsertTarget);
}

function getPagesCount(pageContent){
	let pages = pageContent.getElementsByClassName("paginate-pages")[0]
	if (!pages) { return 1 }
	pages = pages.getElementsByTagName("li")

	const maxPage = pages[pages.length - 1].outerText;
	return maxPage;
}

function getPageUrl(pageNumber){
	let url = getListUrl(document.URL);
	(pageNumber > 1) ?
			url += "page/" + pageNumber:
			url = url.split("page/")[0];
	return url
}

function getPageNumber(URL){
    if (URL.search("/?") != -1){
        URL = URL.split("?")[0];
    }

    let pageNumber = 1;
    if(document.URL.match("/page/")){
        pageNumber = document.URL.split("/page/")[1];
        if ( pageNumber.split().length > 1 ){
            pageNumber = pageNumber.split("/")[0];
        }
    }
    return pageNumber;
}

function getListUrl(pageUrl){
	let listUrl = pageUrl.toLowerCase();

	if (listUrl.search("/?") != -1){
			listUrl = pageUrl.split("?")[0];
	}

	if (listUrl.search("page/")){
			listUrl = pageUrl.split("page/")[0];
	}

	return listUrl
}

function maximizeContent(){
	const contentWrapper = document.getElementById("content").getElementsByClassName(
																									"content-wrap")[0];
	const contentColWrapper = contentWrapper.getElementsByClassName("col-main")[0]
	const gridElement = getGrid(document);

	contentWrapper.style = "width: 100%; margin: 0em 2em";
	contentColWrapper.style = "width: 100%;";
	gridElement.classList.add("lpGrid");
	gridElement.scrollIntoView();
}

function prepareGrid(keepIndex, keepCount){
	const listGrid = getGrid(document);
	const cards = listGrid.getElementsByClassName("poster-container");
	const maxIndex = cards.length -1;
	keepCount = Math.min(keepCount, cards.length);

	console.debug(listGrid, cards)

	const keep = [keepIndex]
	for (i = 0; i < keepCount - 1; i++){

			let randomNum = getRandomIntInclusive(0, maxIndex);
			let searchIndex = 0;
			while (keep.includes(randomNum)){
					searchIndex++;

					const forwardIndex = Math.min(randomNum + searchIndex, maxIndex);
					if (!keep.includes(forwardIndex)){
							randomNum = forwardIndex
							break;
					}

					const backIndex = Math.max(randomNum - searchIndex, 0);
					if (!keep.includes(backIndex)){
							randomNum = backIndex
							break;
					}
			}
			keep.push(randomNum)
	}

	const keepCards = [];
	for (i=0; i < keep.length; i++){
		keepCards.push(cards[keep[i]])
	}

	for (i = 0; i <= maxIndex; i++){
		if (!(keep.includes(i))){
			cards[i].style.display = "none";
		}else{
			cards[i].style.display = "block";
		}
	}

	return keepCards;
}

function highlightCard(card){
	if (highlightedCard){
		highlightedCard.classList.remove("lpSelect");
		highlightedCard.style.zIndex = zMemory;
	}
	zMemory = card.style.zIndex;
	highlightedCard = card;
	card.classList.add("lpSelect");
	card.style.zIndex = 9001;
	//console.debug(card)
}

function getGrid(doc){
	let grid = doc.getElementById("content").getElementsByClassName("film-list")[0];
	if (!grid){
		grid = doc.getElementById("content").getElementsByClassName("poster-list")[0];
	}
	return grid
}

function getCards(elm){
	const cards = elm.getElementsByClassName("poster-container");
	return cards;
}

function animateCarousel(winnerIndex){
	const cards = prepareGrid(winnerIndex, 10);
	const listGrid = getGrid(document);
	const space = (Math.PI * 2) / cards.length;
	
	for (i = 0; i < cards.length; i++){
		const card = cards[i];
		card.style.zIndex = getRandomIntInclusive(1, cards.length);
		card.classList.add("lpFloating");
		card.classList.add("lpHighlight");
		//card.style.borderColor = "grey";
	}

	const rand = Math.random();
	const fps = 48;
	const frameTime = 1/fps;
	const animationTime = FXtime + 2*rand;
	const initSpeed = 1.5;
	let time = -animationTime;
	let speed = initSpeed;
	const speedResistance = initSpeed * (1 / (animationTime*fps) * (0.8 + rand/2));

	const fontSize = Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0]);
	const margin = fontSize * 6;
	console.debug(fontSize, "margin",margin);
	const cardSize = [cards[0].clientWidth, cards[0].clientHeight];

	clearInterval(animId);
	animId = setInterval(frame, frameTime*1000);
	function frame() {
		if (time > 0) {
			clearInterval(animId);
			highlightCard(cards[0]);
			openMovie(cards[0]);
		} else {
			time += frameTime;
			speed -= speedResistance;
			const gridSize = [listGrid.clientWidth, listGrid.clientHeight];

			const minDist = (Math.min(gridSize[0] - margin, gridSize[1] - margin) - Math.max(cardSize[0], cardSize[1])) / 2

			for (i = 0; i < cards.length; i++){
				const card = cards[i];

				const d = time * speed + (space * i);
				const x = minDist * Math.sin(d);
				const y = minDist * Math.cos(d);
				card.style.left = gridSize[0]/2 - cardSize[0]/2 + x + "px";
				card.style.top = gridSize[1]/2 - cardSize[1]/2 - y + "px";

				if (y > minDist-2 && x <= 0){
					highlightCard(card);
				}
			}
		}	
	}
}

function animateLootbox(winnerIndex){
	const cards = prepareGrid(winnerIndex, 10);
	const listGrid = getGrid(document);
	

	const extraCards = 4;
	const rand = Math.random();
	const fps = 48;
	const frameTime = 1/fps;
	const animationTime = FXtime + 2*rand;
	const initSpeed = 1.5;
	let time = -animationTime;
	let speed = initSpeed;
	const speedResistance = initSpeed * (1 / (animationTime*fps) * (0.8 + rand/2));

	const cardSize = [cards[0].clientWidth, cards[0].clientHeight];
	let gridSize = [listGrid.clientWidth, listGrid.clientHeight];
	let cardCenter = (gridSize[0]/2 - cardSize[0]/2);
	const extraSpace = cardSize[0] * extraCards / 2
	let lbLenght =  gridSize[0] + extraSpace *2;
	let space = lbLenght / cards.length;
	
	// first pass
	for (i = 0; i < cards.length; i++){
		const card = cards[i];
		card.style.zIndex = getRandomIntInclusive(1, cards.length);
		card.classList.add("lpFloating");
		card.classList.add("lpHighlight");
		card.style.top = gridSize[1]/2 - cardSize[1]/2 + "px";
		card.style.left = cardCenter + "px";
	}

	clearInterval(animId);
	animId = setInterval(frame, frameTime*1000);

	// animation loop
	let d = -lbLenght;

	function frame() {
		if (time > 0) {
			clearInterval(animId);
			highlightCard(cards[0]);
			openMovie(cards[0]);
		} else {
			time += frameTime;
			speed -= speedResistance;
			gridSize = [listGrid.clientWidth, listGrid.clientHeight];
			cardCenter = gridSize[0]/2 - cardSize[0]/2
			lbLenght =  gridSize[0] + extraSpace *2;
			space = lbLenght / cards.length;
			const offset = extraSpace + cardCenter

			for (i = 0; i < cards.length; i++){
				const card = cards[i];

				d = speed * -time * cardSize[0]*5;
				cardCenter = (gridSize[0]/2 - cardSize[0]/2);
				const cardPos = ((offset + d + space * i) % lbLenght) - extraSpace;
				card.style.left = cardPos + "px";
				card.style.top = gridSize[1]/2 - cardSize[1]/2 + "px";

				if (cardPos - cardCenter > -10 && cardPos - cardCenter <= 10){
					highlightCard(card);
				}
			}
		}	
	}
}

function addStyle(){
	if (document.getElementById("lpStyle"))
		return;
	const s = document.createElement("style");
	s.innerHTML = style;
	s.id = "lpStyle";
	const head = document.getElementsByTagName("head")[0];
	head.appendChild(s);
}
