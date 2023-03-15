/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

//Checks what page is being loaded
 if(window.location.pathname.split("/").pop() == "gameplay.html"){
    /**When the table is clicked it will call markBox which will determine
     * what message should be displayed and what class the cell should be set to.
     * It also checks if the game is over with every click.
     */
    document.querySelector("#boardTable tbody").addEventListener('click', e => {
        console.log("Table was clicked on");
        const tableElement = e.target;
        markBox(tableElement);
        gamePlay.isGameOver();
    });

    /**When the page loads it will display the user's name from get,
     * then it will set up both the gamePlay object and the html table.
     */
    window.addEventListener('load', e => {
        console.log("Page loaded");
        displayUsername();
        gamePlay.playGame();
        createTable("#boardTable tbody");
        createTable("#otherPlayerTable tbody");
    });

    /**When the reset button is clicked it will reset the game, clear messages, inform the user
     * that their game has been reset, reset the html table, and reset the mini html table on the other players page.
     */
    document.querySelector("#btn").addEventListener('click', e => {
        console.log("Game Reset");
        gamePlay.reset();
        //sends a request to reset score back to 0
        $.ajax({
            url:'http://127.0.0.1:3000/player1',
            method: 'GET',
            dataType: 'json',
            data: {"gameState": "gamereset"},
            success: function(data){
                console.log("Game was reset");
            }
        });
        socket.emit('resetGame', {msg: "Game was reset"});
        
    });
}

/**when the page loads it will check if it is index.html and if it is
 * it will then fetch the highest 10 scores from the database.
 */
else if(window.location.pathname.split("/").pop() == "index.html"){
    $(document).ready(function(){
            fetch("http://127.0.0.1:3000/highscores")
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    //If status is 'ok' call createScoreTable
                    createScoreTable("#scoreTable tbody", data);
                })
                .catch(err => {
                    //If status is not 'ok' send and alert to the user to double check the server is running.
                    alert("Something has appeared to go wrong with the server. Please ensure the server is running then try again.");
                });
    });
}