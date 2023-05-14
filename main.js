/* 
This code will run ONLY on letterboxd/(username)/list/*
*/

init()


function init(){
    create_random_button()
    checkURL()
}

function checkURL(){

}

function getRandomMovie(){
    console.log("random now")
}

function create_random_button(){
    
    const __RANDOM_BUTTON = `<button class="button clipboardtrigger has-icon">random</button>`

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

    let curentPage 
        if(document.URL.match("/page/")){
            curentPage = document.URL.split("/page/")[1]
            if ( curentPage.split().length > 1 ){
                curentPage = curentPage.split("/")[0]}
        }else{
            curentPage = 1
        }

    let newUrl = document.URL
    if(document.URL.search("/?") != -1){
    newUrl = document.URL.split("?")[0]
    }
    if (randomPage == curentPage) {
        getRandomMovie()
    }else{
        if(document.URL.search("/page/") != -1){
            newUrl = document.URL.split("page/")[0]
        }
            if (randomPage > 1){
            newUrl += "page/" + randomPage + "?RM=true"
            document.location.href = newUrl
        }else{
            newUrl = newUrl.split("page/")[0] + "?RM=true"
            document.location.href = newUrl
        }
    }
}