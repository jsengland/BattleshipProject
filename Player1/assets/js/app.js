/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

var gamePlay = {
    Battleship: Object.create(battleship),
    //gets then returns the username from GET parameter
    getUsername: function () {
        let usernameDisplay = getParameter("uName");
        return usernameDisplay;
    },
    //uses its battleship member to setup and start a game
    playGame: function () {
        this.Battleship.initialize();
        this.Battleship.createShips();
    },
    //if all ships are marked, it adds a "Game over" message to the message div.
    isGameOver: function(){
        //Checking if each ship in vesselObjects has been hit the same amount of times as its length
        let sunkCount = 0;
        for(let i = 0; i < this.Battleship.vesselObjects.length; i++){
            if(this.Battleship.vesselObjects[i].Hits >= this.Battleship.vesselObjects[i].getLength()){
                sunkCount++;
            }
        }
        if(sunkCount >= this.Battleship.vesselObjects.length){
            addMessage("Game over, you win!");
            return true;
        }
        return false;
    },
    //Resets the game board, resets the message div and starts a new game.
    reset: function(){
        this.playGame();
        clearMessages();
        addMessage("Game was reset");
        createTable("#boardTable tbody");
    }
};

//HELPER FUNCTIONS

/**Retrieves parameters from the GET fields and returns them.
* found how to make this func here: https://youtu.be/j3-LV3XxhVg
*/
function getParameter(parameterName){
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}
