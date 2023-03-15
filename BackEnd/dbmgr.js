/*
	Battleship Part 4 - Multiplayer Battleship
    Author: Jason England
	Class: CSCE 315
	Professor: Nwanze
	Date Due: 12/7/2022
*/

var MongoClient = require('mongodb').MongoClient;
const { ObjectID } = require('bson');
const config = require('./config.json');

const mycollection = config.mycollection;
const myDB = config.myDB;
const url = "mongodb+srv://"+config.username+":" + config.pwd +"@cluster0.yjzs4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

//sets up the collection
exports.setup = function () {
    let cbackfunc;
    createdb(cbackfunc);
    createcl(cbackfunc);
};

//creates the database
let createdb = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        console.log("Database created!");
        db.close();
    });
};

//creates collection
let createcl = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        if (!myDB) {
          console.log("ERROR: Collection undefined. Fix myDB in config file");
          return;
        } 
        var dbo = db.db(myDB);
        dbo.createCollection(mycollection, function (err, res) {
            if (err) throw err;
            console.log("Collection created!");
            db.close();
        });
    });
};

//inserts a record of myobj into the database
exports.insertRec = function (myobj) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted into the database.");
            db.close();
        });
    });
};

//finds a single record with information contained in data
exports.findRec = function (data, callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).findOne({username: data.username}, function (err, result) {
            if (err) throw err;
            callbackFn(result, data.username);
            db.close();
        });
    });
};

//finds all records using a limit (if limit is 0 all records are returned)
exports.findAll = function (limit,res,callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).find({}).limit(limit).toArray(function (err, result) {
            if (err) throw err;
            console.log("Entire Database:");
            console.log(result);
            callbackFn(result,res);
            db.close();
        });
    });
};

//deletes a collection
exports.deleteCollection = function (callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).drop(function (err, delOK) {
            if (err) throw err;
            if (delOK)
                console.log("Collection deleted.");
            db.close();
        });
    });
};

//updates queryData's data in the database to newdata
exports.updateData = function (queryData, newdata, callbackFn) {
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).updateOne(queryData, {$set: newdata}, function (err, res) {
            if (err) throw err;
            console.log("1 document updated.");
            db.close();
        });
    });
};


//MY FUNCTIONS BELOW:

//use this as a callback for findRec to insert new record if unique name not found
exports.insertIfNotFound = function(result,username, callbackFn){
    if(result == null){
        console.log("no match: new user");
        let user = {"username": username, "score": 0};
        exports.insertRec(user);
        console.log(user); //NOTE this is not the object that is correlated to the database, missing _id
       
    }
    else{
        console.log("match: Username already exists");
        console.log(result);
    }
}

//get the user from db and calls updateScore to update the new user score
exports.updateHighScore = function(userStr, newScore, callbackFn){
    let res;
    MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db(myDB);
        dbo.collection(mycollection).findOne({username: userStr}, function (err, result) {
            if (err) throw err;
            callbackFn(result, newScore);
            db.close();
        });
    });


};

//Passes in the user from the db and checks if they got a better score or not hen updates their score accordingly.
exports.updateScore = function(res, newScore){
    if(newScore < res.score || res.score == 0){
        console.log("User had a better score, updated in database");
        exports.updateData({username: res.username}, {score: newScore});
    }
    else{
        console.log("new score is worse then stored score");
    }
}
//Sorts the database by score in asccending order.
exports.sortByScore = function(allScores, res, callbackFn){
    //Found help for this here: https://stackoverflow.com/questions/35249774/remove-all-elements-from-array-that-match-specific-string
    allScores = allScores.filter(function(a){return a.score !== 0});

    allScores.sort(function(a, b) {
        return parseFloat(a.score) - parseFloat(b.score);
    });

    res.end(JSON.stringify(allScores));
}

