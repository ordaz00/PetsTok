"use strict"

let addNew = document.getElementById("myVideos");
addNew.addEventListener("click", switchPage);


function makeDivs(){
  for (let i=0; i<8; i++) {
    let div = document.createElement("div");
    div.classList.add("videoLine");
    let p = document.createElement("p");
    p.classList.add("videoName");
    let but = document.createElement("button");
    but.classList.add("x");
    div.appendChild(p);
    div.appendChild(but);
    let div1 = document.getElementById("div1")
    let div2 = document.getElementById("div2")
    if(i < 4){
      div1.appendChild(div);
    }else{
      div2.appendChild(div);
    }
  }
}

function addActions(buttons){
  for (let i = 0; i < 8; i++) {
    let button = buttons[i];
    button.textContent = "X";
    button.addEventListener("click",
    function () { buttonAction(i) });
  }
}

function switchPage(){
  window.location = "/tiktokpets.html";
}

function buttonAction(i){
  let names = document.getElementsByClassName("videoName");
  console.log("trying to delete video ", i)
  deleteVid("/deleteVid", i)
  .then(async function(data){
    await fillIn(names);
  });
}

async function deleteVid(url, data){
  let addNew = document.getElementById("myVideos");
  addNew.disabled = false;
  addNew.style.background = "rgb(238,29,82)"
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

async function fillIn(names){
  getList("/getList")
  .then(function(data){
    let dataJSON = JSON.parse(data)
    for(let i = 0; i < 8; i++){
      if(i < dataJSON.length){
        let vidName = dataJSON[i].nickname;
        names[i].textContent = vidName;
      }else{
        names[i].textContent = "";
      }
    }    
  });
}

function setUp(){
  makeDivs()
  let names = document.getElementsByClassName("videoName");
  let buttons = document.getElementsByClassName("x");
  addActions(buttons);
  fillIn(names);
  getList("/getList")
  .then(function(data){
    let dataJSON = JSON.parse(data)
    if(dataJSON.length >= 8){
      let addNew = document.getElementById("myVideos");
      addNew.disabled = true;
      addNew.style.background = "#f5f5f5"
    }else{
      let playGame = document.getElementById("continue");
      playGame.disabled = true;
      playGame.style.background = "#f5f5f5"
    }
  });
}

setUp();
