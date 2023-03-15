/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

// var userMoveData = {"username": null, "moveX": null, "moveY": null, "gameState": null, "score": null};
var userMoveData = {"username": null, "moveX": null, "moveY": null, "gameState": null};

var url = "http://ncnwanze.faculty.noctrl.edu/battleshipcoord.php";
var boardXsize = 10, boardYsize = 10;
var vessels = [["Cruiser", 2], ["Submarine", 3], ["Destroyer", 4], ["Battleship", 5]];
var ship = {
    Name: "",
    Length: 0,
    Orientation: "x",
    Hits: 0,
    //sets the name of the ship
    setName: function(name){
        this.Name = name;
    },
    //sets the length of the ship
    setLength: function(length){
        this.Length = length;
    },
    //sets the orientation of the ship
    setOrientation: function(orientation){
        this.Orientation = orientation;
    },
    //gets and returns the name of the ship
    getName: function(){
        return this.Name;
    },
    //gets and returns the length of the ship
    getLength: function(){
        return this.Length;
    },
    //gets and returns the orientation of the ship
    getOrientation: function(){
        return this.Orientation;
    }
};

var battleship = {
    Board: [],
    vesselObjects: [],
    //Creates an empty 10 x 10 board
    initialize: function () {
        this.vesselObjects = []
        for(let i = 0; i < boardYsize; i++){
            this.Board[i] = [];
            for(let j = 0; j < boardXsize; j++){
                this.Board[i][j] = 0;
            }
        }
    },
    //Given a set of coordinates, orientation and size, it checks to see if a vessel of that length can be placed in that position. If it can, it returns true, if not it returns false.
    canIPlaceShip: function (coordinates, orientation, size) {
        //Checks the availability of the selected spots on the board in the X direction based on the size of the ship
        if(orientation == "x"){
            for(let i = 0; i < size; i++){
                if(coordinates.X + i >= boardXsize){
                    return false;
                }
                else if(this.Board[coordinates.Y][coordinates.X + i] != 0){
                    return false;
                }
            }
        }
        //Checks the availability of the selected spots on the board in the Y direction based on the size of the ship
        else{
            for(let i = 0; i < size; i++){
                if(coordinates.Y + i >= boardYsize){
                    return false;
                }
                else if(this.Board[coordinates.Y + i][coordinates.X] != 0){
                    return false;
                }
            }
        }
        return true;
    },
    //Randomly selects a position to place a ship on the board using the ships orientation (x: horizontal, y: vertical) and marks coordinates with the first letter of the ship name.
    putShip: function (ship) {
        let coords = Object.create(pos);
        coords.X = randNumRange(0, boardXsize);
        coords.Y = randNumRange(0, boardYsize);

        //Keeps getting random numbers until one is not taken
        while(!this.canIPlaceShip(coords, ship.getOrientation(), ship.getLength())){
            coords.X = randNumRange(0, boardXsize);
            coords.Y = randNumRange(0, boardYsize);
        }

        //Places the ship in the x direction
        if(ship.getOrientation() == "x"){
            for(let i = 0; i < ship.getLength(); i++){
                this.Board[coords.Y][coords.X + i] = ship.getName();
            }
        }
        //Places the ship in the y direction
        else{
            for(let i = 0; i < ship.getLength(); i++){
                this.Board[coords.Y + i][coords.X] = ship.getName();
            }
        }
    },
    //creates all ship objects with random orientations and calls putShip(ship) to put ships on the board
    createShips: function () {
        //go through vessels
        for (let i = 0; i< vessels.length; i++) {
            //create new vessel
            let newVessel = Object.create(ship);
            //set vessel hits
            newVessel.Hits = 0;
            //set vessel name
            newVessel.setName(vessels[i][0]);
            //set vessel length
            newVessel.setLength(vessels[i][1]);
            //set random vessel orientation
            let randOri = randNumRange(0,2);
            if(randOri == 0){
                newVessel.setOrientation("x");
            }
            if(randOri == 1){
                newVessel.setOrientation("y");
            }
            
            //place vessel on the board
            this.putShip(newVessel);
            this.vesselObjects.push(newVessel);
        }
    },
    //Takes a coordinate parameter and makes a move on the board, also returns what was stored at that location
    makeMove: function (coordinates) {
        // if(!gamePlay.isGameOver() && !(this.Board[coordinates.Y][coordinates.X] == "H" || this.Board[coordinates.Y][coordinates.X] == "M")){
        //     totalClicks++;
        // }

        //Make sure the data stored at the location is not an empty spot, hit spot, or missed spot
        if(this.Board[coordinates.Y][coordinates.X] != 0 && this.Board[coordinates.Y][coordinates.X] != "H" && this.Board[coordinates.Y][coordinates.X] != "M"){
            addMessage("You hit my " + this.Board[coordinates.Y][coordinates.X]);

            //Setting local userMoveData with new info
            userMoveData.username = gamePlay.getUsername();
            userMoveData.moveX = coordinates.X;
            userMoveData.moveY = coordinates.Y;
            userMoveData.gameState = "hit";
            // userMoveData.score = totalClicks;
            //sendUserData();

            //Checks if the ship has been hit enough times to be sunk
            for (let i = 0; i < this.vesselObjects.length; i++) {
                if(this.vesselObjects[i].getName() == this.Board[coordinates.Y][coordinates.X]){
                    this.vesselObjects[i].Hits++;
                    if(this.vesselObjects[i].Hits >= this.vesselObjects[i].getLength()){
                        addMessage("You sunk my " + this.Board[coordinates.Y][coordinates.X]);

                        //Setting local userMoveData with new info
                        userMoveData.username = gamePlay.getUsername();
                        userMoveData.moveX = coordinates.X;
                        userMoveData.moveY = coordinates.Y;
                        userMoveData.gameState = "sunk";
                        // userMoveData.score = totalClicks;
                        //sendUserData();

                    }
                    //returning ship that was hit
                    let shipType = this.Board[coordinates.Y][coordinates.X];
                    this.Board[coordinates.Y][coordinates.X] = "H";

                    if(gamePlay.isGameOver()){
                        //Setting local userMoveData with new info
                        userMoveData.username = gamePlay.getUsername();
                        userMoveData.moveX = coordinates.X;
                        userMoveData.moveY = coordinates.Y;
                        userMoveData.gameState = "gameover";
                        // userMoveData.score = totalClicks;
                        //sendUserData();
                    }
                    sendUserData();
                    return shipType;
                }
            }
        }
        //If square was already hit, informs user
        else if(this.Board[coordinates.Y][coordinates.X] == "H" || this.Board[coordinates.Y][coordinates.X] == "M"){
            addMessage("square already attacked, select another one.");
        }
        //Informs user that they missed and returns "M"
        else{
            this.Board[coordinates.Y][coordinates.X] = "M";
            addMessage("You missed!");

            if(!gamePlay.isGameOver()){
                //Setting local userMoveData with new info
                userMoveData.username = gamePlay.getUsername();
                userMoveData.moveX = coordinates.X;
                userMoveData.moveY = coordinates.Y;
                userMoveData.gameState = "miss";
                // userMoveData.score = totalClicks;
                sendUserData();



            }
            return "M";
        }
    },
    //Passes in a json object and will get the correct coordinates for the game array, make the move, and mark that box on the table.
    getRemoteMove: function (jsonObj) {
        //If the content of the jsonObj is an array (batch requests)
        if(Array.isArray(jsonObj.content)){
            for(let i = 0; i < jsonObj.content.length; i++){
                processCoords(jsonObj.content[i].xcoordinate, jsonObj.content[i].ycoordinate);
            }
        }
        //If the content of the jsonObj is not an array (single request)
        else{
            processCoords(jsonObj.content.xcoordinate, jsonObj.content.ycoordinate);
        }
    }
};

//HELPER FUNCTIONS AND OBJECTS:
//position object that will contain x and y coordinates and will be passed into canIPlaceShip() function and created in putShip() function
var pos = {
    X: 0,
    Y: 0,
    setPos: function (x, y){
        this.X = x;
        this.Y = y;
    }
}

//Returns the random number in a given range (inclusive min, excluding max)
function randNumRange(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 

//This function passes in the x and y coordinate from a json obj and will make a move to the game
//This code was previously in getRemoteMove but is now moved here to keep DRY method.
function processCoords(x, y){
    //Getting x and y coord from jsonObj and converting it to proper location in the game's array.
    let xCoord = x.charCodeAt(0) - 65;
    let yCoord = y - 1;
    //Gets the box on the table that correlates with retrieved x and y coords.
    let table = document.querySelector("#boardTable");
    let allRows = table.querySelectorAll("tr");
    let desiredCols = allRows[yCoord+1].querySelectorAll("td");
    let finalBox = desiredCols[xCoord];
    //Prints coordinates that were retrieved to the message board
    addMessage("Coordinates retrieved from headquarters: " + x + y);
    //Calls markBox func on the proper box which marks the location and calls makeMove from within the func.
    markBox(finalBox);
}



//This function will send the user data to the correct route and the websocket
//Called in makeMove()
function sendUserData(){

    // if(userMoveData.gameState == "hit"){
        // if(!gamePlay.isGameOver()){
            $.ajax({
                url:'http://127.0.0.1:3000/player2',
                method: 'GET',
                dataType: 'json',
                data: userMoveData,
                success: function(data){
                    console.log("new player status");
                }
            });
            socket.emit('clicks2', userMoveData);
        // }
    // }


    // else if(userMoveData.gameState == "sunk"){
    //     // if(!gamePlay.isGameOver()){
    //         $.ajax({
    //             url:'http://127.0.0.1:3000/player1',
    //             method: 'GET',
    //             dataType: 'json',
    //             data: userMoveData,
    //             success: function(data){
    //                 console.log("POST REQUEST WAS MADE");
    //             }
    //         });
    //     // }
    // }


    // else if(userMoveData.gameState == "gameover"){
    //     $.ajax({
    //         url:'http://127.0.0.1:3000/player1',
    //         method: 'GET',
    //         dataType: 'json',
    //         data: userMoveData,
    //         success: function(data){
    //             console.log("POST REQUEST WAS MADE");
    //         }
    //     });
    // }

    // else if(userMoveData.gameState == "miss"){
    //     $.ajax({
    //         url:'http://127.0.0.1:3000/player1',
    //         method: 'GET',
    //         dataType: 'json',
    //         data: userMoveData,
    //         success: function(data){
    //             console.log("POST REQUEST WAS MADE");
    //         }
    //     });
    // }


}


