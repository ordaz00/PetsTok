"use strict"

window.addEventListener( "pageshow", function ( event ) {
var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    // Handle page restore.
    window.location.reload();
  }
});

function setUpContinueButton(){
  getList("/getList")
  .then(function(data){
    let dataJSON = JSON.parse(data);
    if(dataJSON.length >= 8){
      let contButton = document.getElementById("continue");
      contButton.disabled = true;
      contButton.style.background = "#f5f5f5"
      window.alert("The database is full of videos, and the games is ready to be played. Please press the 'My Videos' button to return to the My Videos page, where you will be able to continue with the game.");
    }else{
      console.log("I entered here")
      let contButton = document.getElementById("continue");
      contButton.addEventListener("click", getInput);
    }
  });
}

if(performance.navigation.type == 2){
   location.reload(true);
}

setUpContinueButton();

let myVideo = document.getElementById("myVideos");
myVideo.addEventListener("click", switchPage);

function switchPage(){
  window.location = "/myVideos.html";
}

function getInput(){
  let uName = document.getElementById("username").value;
  let URL = document.getElementById("tikTokUrl").value;
  let nickname = document.getElementById("nickname").value;
  document.getElementById("username").value = "";
  document.getElementById("tikTokUrl").value = "";
  document.getElementById("nickname").value = "";
  let stuff = {"url":URL, "nickname":nickname, "userid":uName};
  let stuffJSON = JSON.stringify(stuff);
  sendPostRequest("/videoData", stuffJSON)
  .then(function(data) {
    console.log(data)
    window.location = "/videoViewer.html"; })
  .catch(function(error) {
    console.log("Error occurred:", error)
  });
}

async function sendPostRequest(url,data) {
  console.log("about to send post request");
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: data });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}

async function getList(url){
  let response = await fetch(url, {
    method: 'POST', 
    headers: {'Content-Type': 'text/plain'},
    body: "" });
  if (response.ok) {
    let data = await response.text();
    return data;
  } else {
    throw Error(response.status);
  }
}