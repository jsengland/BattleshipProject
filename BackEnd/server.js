/*
  Battleship Part 4 - Multiplayer Battleship
  Author: Jason England
  Class: CSCE 315
  Professor: Nwanze
  Date Due: 12/7/2022
*/

//load local coord generator module
const getCoords = require('./battleshipmoves.js');
const url = require('url');

//use the routes module
var routes = require('./routes.js');

// Importing express and cors
const express = require('express');
const cors = require('cors');

//seting up port and hostname
const hostname = '127.0.0.1';
const port = 3000;

// Creating instance of express
const app = express();

//used for socket
var http = require('http').Server(app);
const io = require("socket.io")(http, {cors: {origin: "*", methods: ["GET", "POST"]}});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Apply CORS to allow cross origin access
app.use(cors());

//use routes modue for /
app.use('/', routes);


//websocket part
// var users = 0;
io.on('connection', function (socket) {
  console.log("user connected");
    io.sockets.emit('broadcast', {msg: 'connected'});
    io.sockets.emit('broadcast2', {msg: 'connected'});
  //   //listen for and broadcast clicks
    socket.on('clicks', function(data){
        io.sockets.emit('clicked2', data);
    });
    socket.on('resetGame', function(data){
      io.sockets.emit('gameReset2', data);
    });


    socket.on('clicks2', function(data){
      io.sockets.emit('clicked', data);
  });
  socket.on('resetGame2', function(data){
    io.sockets.emit('gameReset', data);
  });
});


// Listening to server at port 3000
http.listen(port, hostname, function () {
	console.log(`Server running at http://${hostname}:${port}/`);
});
