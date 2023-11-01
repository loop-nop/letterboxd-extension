/* 
This code will run ONLY on 
    letterboxd/(username)/list/*
    letterboxd/(username)/watchlist/*
*/
const MAGIC_WORD = "random"
let button = null;
const fastRandom = false;

init()


function init(){
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

function _showMoviePopup(){
    const popup = document.createElement("ul");
    popup.classList.add("smenu-menu");
    popup.id = "random-popup";
    popup.style = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); display: block;";

    document.getElementById("content").appendChild(popup);
    return popup;
}