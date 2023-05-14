/* 
This code will run ONLY on letterboxd/(username)/list/*
*/

const __RANDOM_BUTTON = `<button class="button clipboardtrigger has-icon">random</button>`
const __MAGIC_WORD = "random"



init()


function init(){
    create_random_button()

    if(checkURL()){
        return
    }
}

function checkURL(){
    if (window.location.search.search(__MAGIC_WORD)){
        getRandomMovie()

        return true
    }

    return false
}

function getRandomMovie(){
    console.log("random now")

    let movies = document.getElementById("content").getElementsByClassName("poster-list")[0].getElementsByTagName("li")
    console.log(movies.length);
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
    let pages = document.getElementsByClassName("paginate-pages")[0]
    .getElementsByTagName("li")
    let maxPage = pages[pages.length - 1].outerText
    let randomPage = Math.floor(( Math.random() * maxPage ) + 1)
    let curentPage = getPageNumber(document.URL) 

    let newUrl = getBaseURL(document.URL)
    if (randomPage == curentPage) {
        getRandomMovie()
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