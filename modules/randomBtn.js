/* 
This code will run ONLY on 
    letterboxd/(username)/list/*
    letterboxd/(username)/watchlist/*
*/
const MAGIC_WORD = "random"
let button = null;
let higlightedCard = null
let zMemory = null
let animId = null;
const fastRandom = false;

const style = `

.lpGrid {
	!important;
	height: 100vh;
	flex: auto;
	margin-right: 2em;
}

.lpGrid > li {
	height: fit-content;
}

.lpHiglight {
	border: 5px pink solid;
	z-index: 9001;
}

.lpFloating {
	height: fit-content;
	position: absolute;
	left: 50%;
	top: 50%;
}

.lpCenter {
	animation: test 5s 5s;
	transform: translate(-50%, -50%);
}

`


init()

// test
maximazeContent()
const cards = prepareGrid(0, 10)
CaruselCards(cards)

function init(){
	addStyle()

	const magicIndex = getMagicWord()
	//console.debug(magicIndex)
	if(magicIndex != null){
			// let popup = showMoviePopup()
			// popup.appendChild( getRandomMovie() )

			openMovie(magicIndex)
			return
	}else{
			createRandomButton()
	}
}

function start(){
	button.disabled = true;
	const totalPages = getPagesCount(document);
	if (totalPages > 1) {
			if (fastRandom){
					const randomPage = getRandomIntInclusive(1, totalPages);
					goToMovie(randomPage)
			}else{
					const firstPageUrl = getPageUrl(1);
					const paginationSize = getPageSize(firstPageUrl);
					const lastPageUrl = getPageUrl(totalPages);
					const lastPageSize = getPageSize(lastPageUrl);

					Promise.all([paginationSize, lastPageSize]).then( (values) => {
							const totalMoviesCount = values[0] * (totalPages - 1) + values[1];
							const randomMovieIndex = getRandomIntInclusive(1, totalMoviesCount);
							const moviePage = Math.floor(randomMovieIndex/values[0]);
							const movieIndex = randomMovieIndex%values[0];

							console.debug("pagination =", values[0], "lastPageSize =", values[1], "total:", totalMoviesCount, totalPages, randomMovieIndex, moviePage, movieIndex)
							goToMovie(moviePage, movieIndex);
					});
			}
	}else{
			goToMovie(1)
	}
}

function goToMovie(pageNumber, movieIndex = -1){
	const currentPage = getPageNumber(document.URL);
	console.debug("goToMovie", pageNumber, movieIndex)

	if (currentPage == pageNumber) {
			openMovie(movieIndex);
	}else{
			const movieUrl = getPageUrl(pageNumber);
			if (movieUrl){
					const url  = [movieUrl, "?", MAGIC_WORD, "=", movieIndex].join("");
					document.location.href = url;
			}else{
					document.search = "";
					document.location.href = "https://letterboxd.com";
			}
	}
}

function openMovie(index){
	const movieCard = getMovieElement(index);
	let url = movieCard.getElementsByClassName("film-poster")[0].getAttribute("data-target-link");
	if (url != null){
			url = "https://letterboxd.com" + url;
	}
	else{
			url = movieCard.getElementsByTagName("a")[0].href;
	}

	//console.debug(movieCard, "https://letterboxd.com" + url);
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
	const movies = pageContent.getElementById("content").getElementsByClassName("poster-list")[0].getElementsByTagName("li")
	return movies;
}

function getMovieElement(index){
	const movies = getPageMovies(document);
	if (index < 1){
			index = getRandomIntInclusive(1, movies.length)
	}
	
	//console.debug(index,  movies[index-1]);
	if (movies.length < index){
			console.error("wrong movie index")
			return
	}
	
	return movies[index-1];
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

function maximazeContent(){
	const contentWraper = document.getElementById("content").getElementsByClassName(
																									"content-wrap")[0];
	const contentColWraper = contentWraper.getElementsByClassName("col-main")[0]
	const gridElement = contentColWraper.getElementsByClassName("film-list")[0];

	contentWraper.style = "width: auto; margin: 0em 2em";
	contentColWraper.style = "width: 100%;";
	gridElement.classList.add("lpGrid");
	gridElement.scrollIntoView();
}

function prepareGrid(keepIndex, keepCount){
	const listGrid = document.getElementsByClassName("poster-list")[0];
	const cards = listGrid.getElementsByClassName("poster-container");
	const maxIndex = cards.length -1;
	keepCount = Math.min(keepCount, cards.length);

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
	if (higlightedCard){
		higlightedCard.classList.remove("lpHiglight");
		higlightedCard.style.zIndex = zMemory;
	}
	zMemory = card.style.zIndex;
	higlightedCard = card;
	card.classList.add("lpHiglight");
	card.style.zIndex = 9001;
	//console.debug(card)
}


function CaruselCards(cards){
	const listGrid = document.getElementsByClassName("poster-list")[0];

	const space = (Math.PI * 2) / cards.length;
	
	for (i = 0; i < cards.length; i++){
		const card = cards[i];
		card.style.zIndex = getRandomIntInclusive(1, cards.length)
	}

	const rand = Math.random()
	const fps = 60
	const frameTime = 1/fps
	const animationTime = 2 + 2*rand
	const initSpeed = 2
	let time = -animationTime
	let speed = initSpeed
	clearInterval(animId);
	animId = setInterval(frame, frameTime*1000);
	function frame() {
		if (time > 0) {
			clearInterval(animId);
			highlightCard(cards[0]);
		} else {
			time += frameTime;
			speed -= initSpeed * 1 / (animationTime*fps) * (rand+0.6)

			const cardSize = [cards[0].clientWidth, cards[0].clientHeight];
			const gridSize = [listGrid.clientWidth, listGrid.clientHeight];

			const minDist = (Math.min(gridSize[0], gridSize[1]) - Math.max(cardSize[0], cardSize[1])) / 2

			for (i = 0; i < cards.length; i++){
				const card = cards[i];
				card.classList.add("lpFloating");
				//card.classList.add("lpCenter");

				const d = time * speed + (space * i)
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

function addStyle(){
	if (document.getElementById("lpStyle"))
		return;
	const s = document.createElement("style")
	s.innerHTML = style
	s.id = "lpStyle"
	const head = document.getElementsByTagName("head")[0]
	head.appendChild(s);
}
