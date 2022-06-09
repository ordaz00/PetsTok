let videoElmts = document.getElementsByClassName("tiktokDiv");

let reloadButtons = document.getElementsByClassName("reload");
let heartButtons = document.querySelectorAll("div.heart");
let filledInHearts = document.querySelectorAll("div.filledInHeart");
let cont = document.getElementById("nxt")
cont.addEventListener("click", next)

let vid1;
let vid2;
let better;
let worse;

async function next(){
  let pref = '{"better": ' + better + ', "worse": ' + worse + "}";
  let jPref = JSON.parse(pref);
  sendPostRequest("/insertPref", jPref)
  .then(async function(data){
    if(data == "continue"){
      location.reload();
    }else{
      window.location = "/winner.html";
    }
  });
}

for (let i=0; i<2; i++) {
  let reload = reloadButtons[i];
  let heart = heartButtons[i];
  reload.addEventListener("click",function() { reloadVideo(videoElmts[i]) });
  heart.addEventListener("click", function(){love(i)})
  heartButtons[i].classList.add("unloved");
} // for loop

function love(i){
  let heart = heartButtons[i];
  let filledIn = filledInHearts[i];
  heart.style.display = "none";
  filledIn.style.display = "inline-block";
  if(i == 0){
    let heart2 = heartButtons[1];
    let filledIn2 = filledInHearts[1];
    heart2.style.display = "inline-block";
    filledIn2.style.display = "none";
    better = vid1;
    worse = vid2;
  }else{
    let heart2 = heartButtons[0];
    let filledIn2 = filledInHearts[0];
    heart2.style.display = "inline-block";
    filledIn2.style.display = "none";
    better = vid2;
    worse = vid1;
  }
}

// hard-code videos for now
// You will need to get pairs of videos from the server to play the game.

async function getVideos(url){
  let response = await fetch(url, {
    method: 'GET', 
    headers: {'Content-Type': 'text/plain'}});
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function insertVids(){
  getVideos("/getTwoVideos")
  .then(async function(data){
    let jsonData = JSON.parse(data);
    let names = document.getElementsByClassName("videoName");
    vid1 = jsonData[0].rowIdNum;
    vid2 = jsonData[1].rowIdNum;
    names[0].textContent = jsonData[0].nickname.charAt(0).toUpperCase() + jsonData[0].nickname.slice(1);
    names[1].textContent = jsonData[1].nickname.charAt(0).toUpperCase() + jsonData[1].nickname.slice(1);
    //console.log(jsonData);
    for (let i=0; i<2; i++) {
      //console.log(jsonData[i].url);
      addVideo(jsonData[i].url,videoElmts[i]);
    }
    // load the videos after the names are pasted in! 
    loadTheVideos();
  });
}
insertVids();





    