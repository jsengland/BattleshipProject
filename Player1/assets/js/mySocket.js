/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

var myURL = "http://127.0.0.1:3000";
// let username = "User" + Math.floor(Math.random() * 1000);
// showUsername(username);

//connect to socket
var socket = io(myURL, {secure: true});
$.ajax({
    url: myURL,
    type: 'GET',
    success: function (data) {
        socket.emit('emit_from_here');
    }
});
//show number of players
socket.on('broadcast', function (data) {
	console.log("Player1 Connected");
});
//show button was clicked
socket.on('clicked', function (data) {
    markOtherPlayerBox(data);

    // $(document).ready(function(){
    //     fetch("http://127.0.0.1:3000/player1")
    //         .then(response => {
    //             return response.json();
    //         })
    //         .then(data => {
    //             //If status is 'ok' call createScoreTable
    //             markOtherPlayerBox(data);
    //             createScoreTable("#scoreTable tbody", data);
    //         })
    //         .catch(err => {
    //             //If status is not 'ok' send and alert to the user to double check the server is running.
    //             alert("Something has appeared to go wrong with the server. Please ensure the server is running then try again.");
    //         });
    // });
});
socket.on('gameReset', function (data) {
    createTable("#otherPlayerTable tbody");
});

