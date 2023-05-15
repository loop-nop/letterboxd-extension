/* 
This code will run ONLY on letterboxd/(username)/list/*
*/

const __RANDOM_BUTTON = `<button class="button clipboardtrigger has-icon">random</button>`
const __MAGIC_WORD = "random"



init()


function init(){
    create_random_button()

    if(hasMagicNumber()){
        // let popup = showMoviePopup()
        // popup.appendChild( getRandomMovie() )
        goToRandomMovie()
    }
}

function hasMagicNumber(){
    if (window.location.search.match(__MAGIC_WORD)){
        return true
    }else{
        return false
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

function getRandomMovieElement(){
    console.log("random now")

    let movies = document.getElementById("content").getElementsByClassName("poster-list")[0].getElementsByTagName("li")
    let randomMovieNumber = getRandomIntInclusive(0, movies.length - 1)
    return movies[randomMovieNumber] 
}

function goToRandomMovie(){
    console.log("goToRandomMovie");
    let newURL
    newURL = getRandomMovieElement().getElementsByClassName("film-poster")[0].getAttribute("data-target-link")
    if (newURL == null) {
        newURL = getRandomMovieElement().getElementsByTagName("a")[0].href;
        document.location.href = newURL
    }else{
        document.search = ""
        document.location.href = "https://letterboxd.com" + newURL
    }
}


function create_random_button(){
    let ButtonSpace = document.createElement("li")
    ButtonSpace.classList.add("panel-signin")
    ButtonSpace.innerHTML = __RANDOM_BUTTON.trim();
    ButtonSpace.onclick = goToRandomPage;

    let UserPanel = document.getElementById("userpanel").getElementsByTagName("ul")[0]
    let InsertTarget = UserPanel.getElementsByTagName("li")[0]
    let RandomButton =  UserPanel.insertBefore(ButtonSpace, InsertTarget)
}

function goToRandomPage(){
    console.log("goToRandomPage");
    let pages = document.getElementsByClassName("paginate-pages")[0]
    if (!pages) {
        goToRandomMovie();
        return;
    }
    pages = pages.getElementsByTagName("li")

    let maxPage = pages[pages.length - 1].outerText
    let randomPage = getRandomIntInclusive(1, maxPage)
    let curentPage = getPageNumber(document.URL) 
    let newUrl = getBaseURL(document.URL)

    console.log(randomPage);
    console.log(curentPage);
    if (randomPage == curentPage) {
        goToRandomMovie()
    }else{
        if (randomPage > 1){
            newUrl += "page/" + randomPage + "?" + __MAGIC_WORD
            document.location.href = newUrl
        }else{
            newUrl = newUrl.split("page/")[0] + "?" + __MAGIC_WORD
            document.location.href = newUrl
        }
    }
}

function getPageNumber(URL){
    if (URL.search("/?") != -1){
        URL = URL.split("?")[0]
    }

    let pageNumber = 1
    if(document.URL.match("/page/")){
        pageNumber = document.URL.split("/page/")[1]
        if ( pageNumber.split().length > 1 ){
            pageNumber = pageNumber.split("/")[0]
        }
    }
    return pageNumber
}

function getBaseURL(URL){
    URL = URL.toLowerCase()
    if (URL.search("/?") != -1){
        URL = URL.split("?")[0]
    }
    if (URL.search("page/")){
        URL = URL.split("page/")[0]
    }

    return URL
}

function showMoviePopup(){
    let popup = document.createElement("ul")
    popup.classList.add("smenu-menu")
    popup.id = "random-popup"
    popup.style = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); display: block;"

    document.getElementById("content").appendChild(popup)
    return popup
}