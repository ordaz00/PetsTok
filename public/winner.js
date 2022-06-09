// when this page is opened, get the most recently added video and show it.
// function is defined in video.js
let divElmt = document.getElementById("tiktokDiv");

let reloadButton = document.getElementById("reload");
// set up button to reload video in "tiktokDiv"
reloadButton.addEventListener("click",function () {
  reloadVideo(tiktokDiv);
});

let winningUrl = "https://www.tiktok.com/@catcatbiubiubiu/video/6990180291545468166";


// always shows the same hard-coded video.  You'll need to get the server to 
// compute the winner, by sending a 
// GET request to /getWinner,
// and send the result back in the HTTP response.

showWinningVideo()


function showWinningVideo() {
  getWinner("/getWinner")
  .then(function(data){
    let jsonData = JSON.parse(data);
    console.log("data = ",jsonData);
    winningUrl = jsonData.url;
    let names = document.getElementsByClassName("videoName");
    names[0].textContent = jsonData.nickname.charAt(0).toUpperCase() + jsonData.nickname.slice(1);
    console.log("winning url = ", winningUrl);
    addVideo(winningUrl, divElmt);
    loadTheVideos();
  }); 
}

async function getWinner(url){
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
