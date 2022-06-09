"use strict"
// index.js
// This is our main server file

// include express
const express = require("express");
const fetch = require("cross-fetch");
// get Promise-based interface to sqlite3
const db = require('./sqlWrap');

const bodyParser = require('body-parser');

// create object to interface with express
const app = express();

// Code in this section sets up an express pipeline
app.use(express.static("public"));

// print info about incoming HTTP request 
// for debugging
app.use(function(req, res, next) {
  console.log(req.method,req.url);
  next();
})

app.use(express.json());

// make all the files in 'public' available 
app.use(express.static("public"));

// if no file specified, return the main page
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/public/myVideos.html");
});

app.use(express.json());

// gets text out of the HTTP body and into req.body
app.use(bodyParser.text());

async function insertVideo(v) {
  const sql = "insert into VideoTable (url,nickname,userid,flag) values (?,?,?,TRUE)";

await db.run(sql,[v.url, v.nickname, v.userid]);
}

async function getVideo(nickname) {

  // warning! You can only use ? to replace table data, not table name or column name.
  const sql = 'select * from VideoTable where nickname = ?';

let result = await db.get(sql, [nickname]);
return result;
}

async function changeFlag() {

  const sql = 'select * from VideoTable where flag = ?';
  let result = await db.get(sql, [1]);
  const sql2 = 'update VideoTable set flag = "0" where flag = ?';
  let result2 = await db.run(sql2, [1]);
  return result;
}

async function getVideoByTrueFlag(){
  const sql = 'select * from VideoTable where flag = ?';
  let result = await db.get(sql, [1]);
  return result;
}

async function dumpTable() {
  const sql = "select * from VideoTable";
  
  let result = await db.all(sql);
  return result;
}

async function deleteVid(id){
  let rowNum = Number(id) + 1;
  const sql = "DELETE FROM VideoTable WHERE rowIdNum = ?";
  let result = await db.run(sql,[rowNum]);
  const sql2 = "update VideoTable set rowIdNum = rowIdNum - 1 where rowIdNum > ?";
  let result2 = await db.run(sql2,[rowNum])
  return "mission successful"
}

app.post("/videoData",  async function(req, res, next) {
  const tableContents = await dumpTable();
  if(tableContents.length == 0){
    insertVideo(JSON.parse(req.body));
    res.send("I completed my mission successfully");
  }else if(tableContents.length >= 8){
    console.log("Database full")
    res.send("Mission Failed")
  }else{
    let result = await changeFlag();
    insertVideo(JSON.parse(req.body));
    res.send("I completed my mission successfully");
  }
});

app.post("/getMostRecent", async function(req, res, next) {
  let result = await getVideoByTrueFlag();
  let resultJSON = JSON.stringify(result);
  res.send(resultJSON)
});

app.post("/getList", async function(req, res, next) {
  let result = await dumpTable();
  let resultJSON = JSON.stringify(result);
  res.send(resultJSON)
});

app.post("/deleteVid", async function(req,res,next){
  let data = await deleteVid(req.body);
  res.send(data)
});

// Need to add response if page not found!
app.use(function(req, res){ res.status(404); res.type('txt'); res.send('404 - File '+req.url+' not found'); });

// end of pipeline specification
// Now listen for HTTP requests
// it's an event listener on the server!
const listener = app.listen(3000, function () {
  console.log("The static server is listening on port " + listener.address().port);
});