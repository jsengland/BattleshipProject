/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

//removeClass(element, className) – removes a given class from an element if the class has it. Does nothing otherwise.
function removeClass(element, className){
	element.classList.remove(className);
}

//addMessage(msg) – adds a given text (msg) to the message div.
function addMessage(msg){
	let msgBoard = document.querySelector("#messageBoardDiv");
	let para = document.createElement("p");
	msgBoard.prepend(para);
	para.innerHTML = msg;
}

//clearMessages – Removes all messages from the message div.
function clearMessages(){
	let msgBoard = document.querySelector("#messageBoardDiv");
	changeText(msgBoard, "");

}

//markBox(mark) – Adds a mark message to a given game board box
function markBox(mark){
	// console.log(mark);
	if ((mark !== null) && (mark.tagName.toLowerCase() ==  "td")) {
		//makes move and returns if ship was hit or if it was a miss
		let ship = gamePlay.Battleship.makeMove(mark.position);
		switch(ship){
			//if user misses
			case "M":
				addClass(mark, "missed");
				addClass(mark, "fade");
				changeText(mark, "missed!");
				break;
			//If user hits any ship, set that element to the appropriate ship class
			default:
				for(let i = 0; i < vessels.length; i++){
					if(ship == vessels[i][0]){
						addClass(mark, vessels[i][0]);
						addClass(mark, "fade");
					}
				}
		}
	}
}


//addClass(element, className) – adds a given class to an element if it does not have the class. Does nothing otherwise.
function addClass(element, className) {
	if (element.classList)
		element.classList.add(className)
	else if (!hasClass(element, className)) element.className += " " + className
}

//changes the text of an element with a custom string
function changeText(element, msg) {
	if (element !== null)
		element.innerHTML = msg;
}

//HELPER FUNCTIONS

//Display username
function displayUsername(){
	let username = gamePlay.getUsername();
	changeText(document.querySelector("#username h2"), username);
	
	//Sends username to the /username route
	$.ajax({
		url:'http://127.0.0.1:3000/username',
		method: 'POST',
		dataType: 'json',
		data: {"username": username},
		success: function(data){
			console.log("sent username");
		}
	});
}

//Creates and displays HTML table
function createTable(className){
	let playerClass;
	if(className == "#boardTable tbody"){
		playerClass = "vessel"
	}else{
		playerClass = "otherPlayerVessel"
	}
	//Empties current table
	changeText(document.querySelector(className), "");
	//Creating top row of letters
	let rowHeader = document.createElement("tr");
	document.querySelector(className).appendChild(rowHeader);
	for(let i = 0; i < boardXsize+1; i++){
		let letters = document.createElement("th");
		rowHeader.appendChild(letters);
		if(i == 0){
			changeText(letters, "#");
		}
		else{
			changeText(letters, String.fromCharCode(i+64));
		}
	}
	//Creates empty squares for the table
	for(let i = 0; i < boardYsize; i++){
		let newRow = document.createElement("tr");
		let tabHeader = document.createElement("th");
		changeText(tabHeader, i+1);
		document.querySelector(className).appendChild(newRow);
		newRow.appendChild(tabHeader);
		for(let j = 0; j< boardXsize; j++){
			let newCell = document.createElement("td");
			newCell.position = Object.create(pos);
			newCell.position.setPos(j, i);
			newRow.appendChild(newCell);
			addClass(newCell, playerClass);
		}
	}
}


//This function will check any info sent through the websocket and will mark the correct tile on the small board
function markOtherPlayerBox(dataIn){
	let mark = document.querySelector("#otherPlayerTable tbody").querySelectorAll("tr")[dataIn.moveY + 1].querySelectorAll("td")[dataIn.moveX];

	if ((mark !== null) && (mark.tagName.toLowerCase() ==  "td")) {
		//makes move and returns if ship was hit or if it was a miss
		//let ship = gamePlay.Battleship.makeMove(mark.position);

		if(dataIn.gameState == "miss"){
			addClass(mark, "missed");
			addClass(mark, "fade");
		}
		else if(dataIn.gameState == "hit" || dataIn.gameState == "sunk" || dataIn.gameState == "gameover"){
			addClass(mark, "hit");
			addClass(mark, "fade");
		}
		else{
			alert("other");
		}
	}
}