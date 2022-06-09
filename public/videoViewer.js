// This viewer takes a TikTok video URL and displays it in a nice magenta box, and gives it a reload button in case you want to watch it again. 

// for example, these are hardcoded
let contButton = document.getElementById("continue");
contButton.addEventListener("click", switchPage);

function switchPage(){
  window.location = "/myVideos.html";
}

let example = 'https://www.tiktok.com/@cheyennebaker1/video/7088856562982423854';

getMostRecent("/getMostRecent")
  .then(function(data){
    let dataJSON = JSON.parse(data)
    let urlLine = dataJSON["url"]
    console.log(urlLine);
    example = urlLine;
    addVideo(example,divElmt);
    loadTheVideos();
  });

// grab elements we'll use 
// these are global! 
let reloadButton = document.getElementById("reload");
let divElmt = document.getElementById("tiktokDiv");

// set up button
reloadButton.addEventListener("click",reloadVideo);

// add the blockquote element that TikTok wants to load the video into


// on start-up, load the videos


// Add the blockquote element that tiktok will load the video into
async function addVideo(tiktokurl,divElmt) {
  console.log("I am main: ",tiktokurl);
  let videoNumber = tiktokurl.split("video/")[1];

  let block = document.createElement('blockquote');
  block.className = "tiktok-embed";
  block.cite = tiktokurl;
  // have to be formal for attribute with dashes
  block.setAttribute("data-video-id",videoNumber);
  block.style = "width: 325px; height: 563px;"

  let section = document.createElement('section');
  block.appendChild(section);
  
  divElmt.appendChild(block);
}

// Ye olde JSONP trick; to run the script, attach it to the body
function loadTheVideos() {
  body = document.body;
  script = newTikTokScript();
  body.appendChild(script);
}

// makes a script node which loads the TikTok embed script
function newTikTokScript() {
  let script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js"
  script.id = "tiktokScript"
  return script;
}

// the reload button; takes out the blockquote and the scripts, and puts it all back in again.
// the browser thinks it's a new video and reloads it
function reloadVideo () {
  
  // get the two blockquotes
  let blockquotes 
 = document.getElementsByClassName("tiktok-embed");

  // and remove the indicated one
    block = blockquotes[0];
    console.log("block",block);
    let parent = block.parentNode;
    parent.removeChild(block);

  // remove both the script we put in and the
  // one tiktok adds in
  let script1 = document.getElementById("tiktokScript");
  let script2 = script.nextElementSibling;

  let body = document.body; 
  body.removeChild(script1);
  body.removeChild(script2);

  addVideo(example,divElmt);
  loadTheVideos();
}

async function getMostRecent(url) {
  console.log("about to send post request");
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