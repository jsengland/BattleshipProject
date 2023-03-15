/*
  Battleship Part 4 - Multiplayer Battleship
  Author: Jason England
  Class: CSCE 315
  Professor: Nwanze
  Date Due: 12/7/2022
*/
var player1Score = 0;
var player2Score = 0;

var express = require('express');
var router = express.Router();
var mydb = require('./dbmgr.js');
const url = require('url');


//Setup database, only need to run this once. Unblock to run once then block this line again
// mydb.setup();
// mydb.deleteCollection();

router.get('/', function (req, res){
    console.log("");
});


router.post('/username', function (req, res) {
  let username = req.body;
  res.send("adding the username to the database");
  console.log(username);
  
  mydb.findRec(username, mydb.insertIfNotFound);
  
});


router.get('/player1', function (req, res) {
  var myURL = url.parse(req.url, true);
  gameStatus = myURL.query.gameState;
  if(gameStatus == "gamereset"){
    player1Score = 0;
    console.log("resetting score");
  }
  else{
      player1Stats = myURL.query;
      player1Score +=1; 
      //update the player in the database that matches the username,
      //but only if the saved score in database is less than what the player currently has 
      if(player1Score > 0 && gameStatus == "gameover"){
          mydb.updateHighScore(myURL.query.username, Number(player1Score), mydb.updateScore);
      }
      res.send("player1");
  }
});

router.get('/player2', function (req, res) {
  var myURL = url.parse(req.url, true);
  gameStatus = myURL.query.gameState;
  if(gameStatus == "gamereset"){
    player2Score = 0;
    console.log("resetting score");
  }
  else{
    player2Stats = myURL.query;
    player2Score +=1; 
    //update the player in the database that matches the username,
    //but only if the saved score in database is less than what the player currently has 
    if(player2Score > 0 && gameStatus == "gameover"){
        mydb.updateHighScore(myURL.query.username, Number(player2Score), mydb.updateScore);
    }
    res.send("player2");
}
});

router.get('/highscores', function (req, res) {
  console.log("THIS IS THE ARRAY BEING RETURNED TO /highscores");
  mydb.findAll(0,res, mydb.sortByScore);
});

module.exports = router;
