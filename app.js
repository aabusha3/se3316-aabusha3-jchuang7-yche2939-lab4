// var stringSimilarity = require("string-similarity");
// var similarity = stringSimilarity.compareTwoStrings("healed", "sealed");
// var matches = stringSimilarity.findBestMatch("healed", [
//   "edward",
//   "sealed",
//   "theatre",
// ]);

// var JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;
// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     User.findOne({id: jwt_payload.sub}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user);
//         } else {
//             return done(null, false);
//             // or you could create a new account
//         }
//     });
// }));

// Require modules 
const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const Joi = require('joi');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

app.use(express.json());
app.use('/', express.static('static'));

// Assign port value
const port = process.env.PORT;

// Connect to mongoDB
var database;
app.listen(port, () => {
    MongoClient.connect(process.env.DB_URL,
    {useNewUrlParser: true}, (err, result) => {
        if(err) throw err
        database = result.db('lab-4')
    })
    console.log(`Listening on port ${port} ...`)
    console.log('Database connection successful ...')
});

// Insert one json obj to MongoDB, table name in string, eg. table = "admin"
function insertOneObj(jsonObj, table){
    MongoClient.connect(url, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4")
        dbo.collection(table).insertOne(jsonObj, function(err, res) {
            if(err) throw err
            console.log("1 doc inserted")
            db.close()
        })
    })
}

// Delete one json obj by query from MongoDB Ex: var myquery = {name: "jay"}
function deleteOneObj(myquery, table){
    MongoClient.connect(url, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4")
        dbo.collection(table).deleteOne(myquery, function(err, res) {
            if(err) throw err
            console.log("1 doc deleted")
            db.close()
        })
    })
}

// Update one obj to database
function updateOneObj(myquery, newvalues, table){
    MongoClient.connect(url, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4")
        dbo.collection(table).updateOne(myquery, newvalues, function(err, res) {
            if(err) throw err
            console.log("1 doc updated")
            db.close()
        })
    })
}