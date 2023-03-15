/*
  Battleship Part 4 - Multiplayer Battleship
  Author: Jason England
  Class: CSCE 315
  Professor: Nwanze
  Date Due: 12/7/2022
*/

//gets a random set of coordinates and sends back the json object
exports.generateCoords = function(callbackFn, batchNum) {
  let response;
  if(batchNum == undefined){
    //IF there is no batch number in the url
    //Generating x coord and converting to char
    let randX = String.fromCharCode(Math.floor(Math.random() * (11 - 1) + 1) + 64);
    //Generating y coord
    let randY = Math.floor(Math.random() * (11 - 1) + 1);
    //creating json object with the generated coords
    response = {"status":"success","content":{"xcoordinate":randX,"ycoordinate":randY,"coordinates":
    [randX,randY]}};

  }else if(batchNum >= 1 && batchNum <= 10){
    //If the batch number is less than 10
    response = {"status":"success","content":[]};
    for(let i = 0; i < batchNum; i++){
      //Generating x coord and converting to char
      let randX = String.fromCharCode(Math.floor(Math.random() * (11 - 1) + 1) + 64);
      //Generating y coord
      let randY = Math.floor(Math.random() * (11 - 1) + 1);
      //creating json object with the generated coords
      response.content.push({"xcoordinate":randX,"ycoordinate":randY,"coordinates":[randX,randY]});
    }
  }else{
    //If the number is greater than 10
    response = {"status":"error","content":"404 error. Batch value was invalid."};
  }
  //Calling callback function that was passed in
  callbackFn(response);

};