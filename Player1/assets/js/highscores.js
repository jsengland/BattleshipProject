/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

//This function creates and displays HTML table to display the score on 
function createScoreTable(className, data){
	let playerClass;
	if(className == "#scoreTable tbody"){
		playerClass = "vessel"
	}else{
		playerClass = "otherPlayerVessel"
	}
	//Empties current table
	changeText(document.querySelector(className), "");
	//Creating top row of tableHeaders
	let rowHeader = document.createElement("tr");
	document.querySelector(className).appendChild(rowHeader);
	//fills in the top row with the titles
	for(let i = 0; i < 3; i++){
		let tableHeader = document.createElement("th");
		rowHeader.appendChild(tableHeader);
		if(i == 0){
			changeText(tableHeader, "Placement");
		}
		else if(i == 1){
			changeText(tableHeader, "Username");
		}
		else{
			changeText(tableHeader, "Score");
		}
	}
	//Sets a maximum length for the table of 10
	let tableLength;
	if(data.length <= 10){
		tableLength = data.length;
	}
	else{
		tableLength = 10;
	}
	//Creates empty squares for the table
	for(let i = 0; i < tableLength; i++){
		//Creates row headers
		let newRow = document.createElement("tr");
		let tabHeader = document.createElement("th");
		changeText(tabHeader, i+1);
		document.querySelector(className).appendChild(newRow);
		newRow.appendChild(tabHeader);
		//Populating table
		for(let j = 0; j< 2; j++){
			let newCell = document.createElement("td");
			newRow.appendChild(newCell);
			//Populates table with username and score
			if(j == 0){
				changeText(newCell, JSON.stringify(data[i].username));
			}
			else{
				changeText(newCell, JSON.stringify(data[i].score));
			}
		}
	}
}

//changes the text of an element with a custom string
function changeText(element, msg) {
	if (element !== null)
		element.innerHTML = msg;
}