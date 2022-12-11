// Require modules 
const express = require('express');
const app = express();
const fs = require('fs');
const csv = require('csv-parser');
const Joi = require('joi');
const dotenv = require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const { parse } = require('node-html-parser');
const cors = require('cors');
const { ObjectID } = require('bson');
const stringSimilarity = require("string-similarity");
const { object } = require('joi');

// Create router
const genresRoute = express.Router(),
      artistsRoute = express.Router(),
      albumsRoute = express.Router(),
      tracksRoute = express.Router(),
      listsRoute = express.Router(),
      policyRoute = express.Router(),
      userRouter = express.Router();

app.use(express.json());
app.use(cors());
app.use('/', express.static('static'));
app.use('/api/genres', genresRoute);
app.use('/api/artists', artistsRoute);
app.use('/api/albums', albumsRoute);
app.use('/api/tracks', tracksRoute);
app.use('/api/lists', listsRoute);
app.use('/api/policies', policyRoute);
app.use('/api/user', userRouter);

genresRoute.use(express.json());
artistsRoute.use(express.json());
albumsRoute.use(express.json());
tracksRoute.use(express.json());
listsRoute.use(express.json());
policyRoute.use(express.json());

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

/*
    Methods to interact with the database
*/

// Insert one json obj to MongoDB, table name in string, eg. table = "admin"
function insertOneObj(jsonObj, table){
    MongoClient.connect(process.env.DB_URL, function(err, db){
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
    MongoClient.connect(process.env.DB_URL, function(err, db){
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
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4")
        dbo.collection(table).updateOne(myquery, newvalues, function(err, res) {
            if(err) throw err
            console.log("1 doc updated")
            db.close()
        })
    })
}


////////////////////////justin
//request to insert into db
app.post('/api/playlists', (req, res) => {
    var test = {name: "jay", tracks: "2,3"}
    insertOneObj(test, "public_playlist")
    res.send(test)
})

//request to delete from playlist db
app.delete('/api/playlists', (req, res) => {
    var myquery = {name: "jay"}
    deleteOneObj(myquery, 'public_playlist')
    res.send(myquery)
})

//request to add to admin db and delete from user db
app.post('/api/admin', (req, res) => {
    var test = req.body
    return new Promise((resolve, reject) => {
        resolve(insertOneObj(test, "admin"))
        return new Promise((resolve, reject) => {
            resolve(deleteOneObj(test, "user"))
            return new Promise((resolve, reject) => {
                resolve(res.send(test))
            })
        })
    })
})

//request to delete from admin db only
app.delete('/api/admin', (req, res) => {
    var test = req.body
    deleteOneObj(test, 'user')
    res.send(test)
})

//request to return public playlists
app.get('/api/playlists', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("public_playlist").find({}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

//request to return all users
app.get('/api/user', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("user").find({}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

//request to return all admins
app.get('/api/admin', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("admin").find({}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})


//request to check if user is validated
app.put('/api/userValid/:username', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        var newValues = {$set: {validated: req.body.validated}}
        dbo.collection("user").updateOne({username: req.params.username.toLowerCase()}, newValues,(err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

//request to update password

app.put('/api/updatePassword/:username', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        var newValues = {$set: {password: req.body.password}}
        dbo.collection("user").updateOne({username: req.params.username.toLowerCase()}, newValues,(err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

//request to update deactivate element on account
app.put('/api/deactivate/:username', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        var newValues = {$set: {deactivated: req.body.deactivated}}
        dbo.collection("user").updateOne({username: req.params.username.toLowerCase()}, newValues,(err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

//request to retrieve data based on username to check
app.get('/api/login/:username', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("user").find({username: req.params.username.toLowerCase()}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

//request to check for email for duplicates
app.get('/api/email/:email', (req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("user").find({email: req.params.email.toLowerCase()}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})


//request for login that returns JSON web token
app.post('/api/login', (req, res) => {
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("user").find({email: req.body.email.toLowerCase()}).toArray((err, result) => { 
            if(err) throw err
            if(result[0].password == req.body.password) {
                const token = jwt.sign(result[0], process.env.JWT_KEY)
                console.log(token)
                res.json({
                    token,
                    result
                })
            }
            db.close()
        })
    })
})

//request to hide and unhide a comment on a certain playlist
app.put('/api/playlist/:comment', (req, res) => {
    //connect to database
    ///api/playlist/name-1
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var reference = req.params.comment.split("-")
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        var newValues = {$set: {[`comments.${reference[1]}.hidden`]: req.body.hidden}}
        dbo.collection("private_playlist").updateOne({name: reference[0]}, newValues,(err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})

////////////////////////justin

////////////////////////chen
var ObjectId = require('mongodb').ObjectId; 

policyRoute.route('/pp')
    .get((req, res) => {
        //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("privacy_policy").find({}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
    })
    .post((req, res) => {
        var newObject = {name: req.body.name, description: req.body.description}
        insertOneObj(newObject, "privacy_policy")
        res.send(newObject)
    })

policyRoute.route('/pp/:_id')
.get((req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        var id = req.params._id;       
        var o_id = new ObjectId(id);
        //choose collection and returns entire table
        dbo.collection("privacy_policy").find({_id: o_id}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})
.put((req, res) => {
    var id = req.params._id;       
        var o_id = new ObjectId(id);
        var myquery = {_id: o_id}
        var newValues = {$set: {description: req.body.description}}
        //choose collection and returns entire table
        updateOneObj(myquery, newValues, "privacy_policy")
        res.send(newValues)
})
.delete((req, res) => {
    var id = req.params._id;       
        var o_id = new ObjectId(id);
        var myquery = {_id: o_id}
    deleteOneObj(myquery, "privacy_policy")
    res.send(myquery)
})

policyRoute.route('/aup')
    .get((req, res) => {
        //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("aup").find({}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
    })
    .post((req, res) => {
        var newObject = {name: req.body.name, description: req.body.description}
        insertOneObj(newObject, "aup")
        res.send(newObject)
    })

policyRoute.route('/aup/:_id')
.get((req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        var id = req.params._id;       
        var o_id = new ObjectId(id);
        //choose collection and returns entire table
        dbo.collection("aup").find({_id: o_id}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})
.put((req, res) => {
    var id = req.params._id;       
        var o_id = new ObjectId(id);
        var myquery = {_id: o_id}
        var newValues = {$set: {description: req.body.description}}
        //choose collection and returns entire table
        updateOneObj(myquery, newValues, "aup")
        res.send(newValues)
})
.delete((req, res) => {
    var id = req.params._id;       
        var o_id = new ObjectId(id);
        var myquery = {_id: o_id}
    deleteOneObj(myquery, "aup")
    res.send(myquery)
})

policyRoute.route('/dmca')
    .get((req, res) => {
        //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        //choose collection and returns entire table
        dbo.collection("dmca").find({}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
    })
    .post((req, res) => {
        var newObject = {name: req.body.name, description: req.body.description}
        insertOneObj(newObject, "dmca")
        res.send(newObject)
    })

policyRoute.route('/dmca/:_id')
.get((req, res) => {
    //connect to database
    MongoClient.connect(process.env.DB_URL, function(err, db){
        if(err) throw err
        var dbo = db.db("lab-4") //database reference
        var id = req.params._id;       
        var o_id = new ObjectId(id);
        //choose collection and returns entire table
        dbo.collection("dmca").find({_id: o_id}).toArray((err, result) => { 
            if(err) throw err
            res.send(result)
            db.close()
        })
    })
})
.put((req, res) => {
    var id = req.params._id;       
        var o_id = new ObjectId(id);
        var myquery = {_id: o_id}
        var newValues = {$set: {description: req.body.description}}
        //choose collection and returns entire table
        updateOneObj(myquery, newValues, "dmca")
        res.send(newValues)
})
.delete((req, res) => {
    var id = req.params._id;       
        var o_id = new ObjectId(id);
        var myquery = {_id: o_id}
    deleteOneObj(myquery, "dmca")
    res.send(myquery)
})
////////////////////////chen



////////////////////////ahmad
userRouter.route('/getPrivatePlaylists/:user')
    .get((req, res) => {
        database.collection('private_playlist').find({creator_username: req.params.user.toLowerCase()}).toArray(function(err, result) {
            if (err) throw err;
            if(result.length > 20) result.length = 20;
            return res.send(result)
          });

})
userRouter.route('/trackInfo/:tracks')
    .get((req, res) => {
        const Tracks = strToArr(req.params.tracks)
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(400).send(error.message)})
        .on('data', (data) => {if(Tracks.find(e => e === parseInt(data.track_id))) tracksRes.push(data);})
        .on('end', () => {res.send(JSON.stringify(tracksRes, ["track_id", "track_title", 
        "artist_name", "album_title", "track_duration", "track_genres"])); tracksRes.length=0;});
    });


userRouter.route('/updateList/:user/:oldName/:name/:desc/:tracks/:LDM/:time')
    .get((req, res) => {   
        const Tracks = strToArr(req.params.tracks)
        var quarry = {name: req.params.oldName, creator_username: req.params.user.toLowerCase()}
        var update = { $set: {name: req.params.name, desc: req.params.desc, tracks: Tracks, dateLastModed: req.params.LDM, duration: req.params.time}}
        updateOneObj(quarry, update, "private_playlist")

        var find = database.collection('public_playlist').find(quarry).toArray(function(err, result) {
            if (err) throw err;
            if(result.length > 0)
                updateOneObj(quarry, update, "public_playlist");
        });

        res.send(JSON.stringify(`Playlist '${req.params.name}' has been updated`));
     }) 

userRouter.route('/updateVis/:user/:name/:vis')
    .get((req, res) => {       
        if(req.params.vis === 'true'){//pub to pri
            var quarry = {name: req.params.name, creator_username: req.params.user.toLowerCase()}
            var update = { $set: {public:false}}
            return new Promise((resolve, reject) => {
                resolve(updateOneObj(quarry, update, "private_playlist"))
                return new Promise((resolve, reject) => {
                    resolve(deleteOneObj(quarry, "public_playlist"))
                    return new Promise((resolve, reject) => {
                        resolve(res.send(JSON.stringify(`Playlist '${req.params.name}' Has Been Made Private`)))
                    })
                })
            })
        } 
        else{//pri to pub
            var quarry = {name: req.params.name, creator_username: req.params.user.toLowerCase()}
            var update = { $set: {public:true}}
            var find = database.collection('private_playlist').find(quarry).toArray(function(err, result) {
                if (err) throw err;
                delete result[0]._id
                return new Promise((resolve, reject) => {
                    resolve(updateOneObj(quarry, update, "private_playlist"))
                    return new Promise((resolve, reject) => {
                        resolve(insertOneObj(result[0], "public_playlist"))
                        return new Promise((resolve, reject) => {
                            resolve(res.send(JSON.stringify(`Playlist '${req.params.name}' Has Been Made Public`)))
                        })
                    })
                })
            })
        }
    })

userRouter.route('/deleteList/:user/:name')
    .get((req, res) => {       
        var quarry = {name: req.params.name, creator_username: req.params.user.toLowerCase()}

        database.collection('public_playlist').find(quarry).toArray(function(err, result){
            if (err) throw err;
            if(result.length > 0) deleteOneObj(quarry, "public_playlist");
        })

        database.collection('private_playlist').find(quarry).toArray(function(err, result){
            if (err) throw err;
            if(result.length > 0) deleteOneObj(quarry, "private_playlist");

        })

        res.send(JSON.stringify(`Playlist '${req.params.name}' Has Been Deleted`))
})

userRouter.route('/uniqueName/:user/:name')
    .get((req, res) => {
        database.collection('private_playlist').find({creator_username: req.params.user.toLowerCase()}).toArray(function(err, result) {
            if (err) throw err;
            if(result.find(e => e.name.toLowerCase() === req.params.name.toLowerCase()))
                return res.send(true);
            else return res.send(false);
          });

})

userRouter.route('/newList/:user/:name/:desc/:tracks/:time')
    .get((req, res) => {
        const Tracks = strToArr(req.params.tracks)
        var obj = {name: req.params.name, desc:req.params.desc, imgURL:"require('../assets/music-cover.png')", 
            tracks:Tracks, public:false, creator_username: req.params.user.toLowerCase(), dateLastModed: new Date().toString(), duration: req.params.time}
        insertOneObj(obj, "private_playlist")
        res.send(obj)
})


function timeToInt(duration){
    var textTime = duration.split(':');
    var minToSec = parseInt(textTime[0])*60;
    var totalSec = parseInt(textTime[1]) + minToSec;
    return totalSec
}
function intToTime(secTime){
    var min = parseInt(secTime/60)
    var sec = ''+parseInt(secTime%60)
    sec.length === 1? sec='0'+parseInt(secTime%60) : sec=parseInt(secTime%60)
    return '' + min + ':' + sec;
}
userRouter.route('/find/:tracks')
.get((req, res) => {
    const Tracks = strToArr(req.params.tracks);
    let totalTrackTime = 0
    let totalTrackTimeFormatted = ''
    fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
    .on('error', (error) => res.status(400).send(error.message))
    .on('data', (data) => {
        currentData = parseInt(data.track_id);
        if(Tracks.find(e => e===currentData)){
            totalTrackTime += timeToInt(data.track_duration)
            Tracks.splice(Tracks.findIndex(e => e===currentData),1);
        }
    })
    .on('end', () => { 
            totalTrackTimeFormatted = intToTime(totalTrackTime)
            res.send({found:Tracks.length > 0? false : true, totalTime:totalTrackTimeFormatted})
            totalTrackTime = 0
            totalTrackTimeFormatted = ''
    });
});

userRouter.route('/getPublicPlaylists')
    .get((req, res) => {
        database.collection('public_playlist').find().sort({dateLastModed: -1}).toArray(function(err, result) {
            if (err) throw err;
            if(result.length > 10) result.length = 10;
            return res.send(result)
          });

})

userRouter.route('/getPublicPlaylist/:id')
    .get((req, res) => {
        var id = req.params.id;       
        var o_id = new ObjectId(id);
        database.collection('public_playlist').findOne({_id: o_id}, function(err, result) {
            if (err) throw err;
            return res.send(result)
          });

})

function strToArr(str){
    return str.split(',')
        .filter(e => typeof parseInt(e) === 'number'? parseInt(e):null)
        .map(x => parseInt(x));
}
////////////////////////ahmad


//////////////////  lab 3
var genresRes = [],
      artistsRes = [],
      albumsRes = [],
      tracksRes = [];

function strip(html){
    let striped = parse(html).childNodes[0]._rawText;
    return striped || "";
}
genresRoute.route('/')
    .get((req, res) => {
        fs.createReadStream('./dataset/genres.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => genresRes.push(data))
        .on('end', () => {res.send(JSON.stringify(genresRes, ["genre_id", "title", "parent"])); genresRes.length=0;});
    });


//step 2
artistsRoute.route('/id/:artist_id')
    .get((req, res) => {
        const rId = parseInt(req.params.artist_id);
        fs.createReadStream('./dataset/raw_artists.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if(parseInt(data.artist_id) === rId) res.send(JSON.stringify(data, ["artist_id", 
        "artist_name", "artist_handle", "tags", "artist_url", "artist_favorites", "artist_comments", "artist_date_created"]));})
        .on('end', () => {if(!res.writableEnded) res.status(404).send(JSON.stringify(`Artist ID '${rId}' Does Not Exist`));});
    });

    
//step 3
tracksRoute.route('/find/:track_id')
    .get((req, res) => {
        const tId = parseInt(req.params.track_id);
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if(parseInt(data.track_id) === tId) res.send(JSON.stringify(data, ["album_id", 
        "album_title", "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", "track_duration",
        "track_genres", "track_number", "track_title"]));})
        .on('end', () => {if(!res.writableEnded) res.status(404).send(JSON.stringify(`Track ID '${tId}' Does Not Exist`));});
    });


//step 4
tracksRoute.route('/ttat/:track_title/:album_title')
    .get((req, res) => {   
        const max = 12 
        const tt = strip(req.params.track_title);
        const at = strip(req.params.album_title);
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if((tracksRes.length<max) && ((tt.length>0 && data.track_title.toLowerCase().includes(tt)) || (at.length>0 && data.album_title.toLowerCase().includes(at)))) tracksRes.push(data);})
        .on('end', () => {res.send(JSON.stringify(tracksRes, ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    
    });

tracksRoute.route('/angttt/:artist_name/:genre_title/:track_title')
    .get((req, res) => {   
        const max = 12 
        const an = strip(req.params.artist_name);
        const gt = strip(req.params.genre_title);
        const tt = strip(req.params.track_title);
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if((tracksRes.length<max) && ((an.length>0 && data.artist_name.toLowerCase().includes(an)) || (gt.length>0 && data.track_genres.toLowerCase().includes(gt)) || (tt.length>0 && data.track_title.toLowerCase().includes(tt)))) tracksRes.push(data);})
        .on('end', () => {res.send(JSON.stringify(tracksRes, ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    
    });

    /*If input <=4 characters, 2 mistaken characters not allowed*/
    /*If input <=2 characters, soft match wont work*/
    /*The longer the input the better the performance*/
tracksRoute.route('/tt/:track_title')
    .get((req, res) => {  
        const tt = req.params.track_title
        tracksRes = new Array(12).fill().map(() => ({rating: 0, result: {}}));
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {
            // Find dice formula matching each data
            const temp = stringSimilarity.compareTwoStrings(tt, data.track_title)
            // Find the minimum rating in the array
            const min = tracksRes.map(e => e.rating).reduce((prev, curr) => prev < curr ? prev : curr)
            //gets the index of the min element
            const index = tracksRes.findIndex(e=>e.rating===min);
            if (temp > min){// If dice formula match degree is bigger than the min element in the array
                // Replace the lowest rating result in array with the new one
                tracksRes[index].rating = temp
                tracksRes[index].result = data                
            }
        })
        .on('end', () => {console.log('done');res.send(JSON.stringify(tracksRes.map(e=>e.result), ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    });

    // tracksRoute.route('/tt/:track_title')
    // .get((req, res) => {   
    //     const max = 12 
    //     const tt = strip(req.params.track_title);
    //     fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
    //     .on('error', (error) => {return res.status(500).send(error.message)})
    //     .on('data', (data) => {
    //         if((tracksRes.length<max) && (tt.length>0 && data.track_title.toLowerCase().includes(tt))) 
    //         {tracksRes.push(data)};})
    //     .on('end', () => {res.send(JSON.stringify(tracksRes, ["track_id", "album_id", "album_title",
    //     "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
    //     "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    // });

tracksRoute.route('/at/:album_title')
    .get((req, res) => {   
        const max = 12 
        const at = strip(req.params.album_title);
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if((tracksRes.length<max) && (at.length>0 && data.album_title.toLowerCase().includes(at))) tracksRes.push(data);})
        .on('end', () => {res.send(JSON.stringify(tracksRes, ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    });

tracksRoute.route('/gr/:genre_title')
    .get((req, res) => {   
        const gr = req.params.genre_title
        tracksRes = new Array(12).fill().map(() => ({rating: 0, result: {}}));
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {
            // Find dice formula matching each data
            try{
                const temp = stringSimilarity.compareTwoStrings(gr, JSON.parse(data.track_genres.replace(/'/g, '"'))[0].genre_title)
                // Find the minimum rating in the array
                const min = tracksRes.map(e => e.rating).reduce((prev, curr) => prev < curr ? prev : curr)
                //gets the index of the min element
                const index = tracksRes.findIndex(e=>e.rating===min);
                if (temp > min){// If dice formula match degree is bigger than the min element in the array
                    // Replace the lowest rating result in array with the new one
                    tracksRes[index].rating = temp
                    tracksRes[index].result = data                
                }
            }
            catch(e){}
        })
        .on('end', () => {console.log('done');res.send(JSON.stringify(tracksRes.map(e=>e.result), ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    });

tracksRoute.route('/an/:artist_name')
    .get((req, res) => {   
        const an = req.params.artist_name
        tracksRes = new Array(12).fill().map(() => ({rating: 0, result: {}}));
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {
            // Find dice formula matching each data
            const temp = stringSimilarity.compareTwoStrings(an, data.artist_name)
            // Find the minimum rating in the array
            const min = tracksRes.map(e => e.rating).reduce((prev, curr) => prev < curr ? prev : curr)
            //gets the index of the min element
            const index = tracksRes.findIndex(e=>e.rating===min);
            if (temp > min){// If dice formula match degree is bigger than the min element in the array
                // Replace the lowest rating result in array with the new one
                tracksRes[index].rating = temp
                tracksRes[index].result = data                
            }
        })
        .on('end', () => {console.log('done');res.send(JSON.stringify(tracksRes.map(e=>e.result), ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    });


//step 5
artistsRoute.route('/name/:artist_name')
    .get((req, res) => {   
        const max = 12 
        const name = strip(req.params.artist_name);
        fs.createReadStream('./dataset/raw_artists.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if((artistsRes.length<max) && (name.length>0 && data.artist_name.toLowerCase().includes(name))) artistsRes.push(data);})
        .on('end', () => {res.send(JSON.stringify(artistsRes, ["artist_id", "artist_name", "artist_handle",
        "tags", "artist_url", "artist_favorites", "artist_comments", "artist_date_created"])); artistsRes.length=0;});
    });


//step 6
listsRoute.route('/create/:name')
    .get((req, res) => {
        const name = strip(req.params.name);
        const path = `./StoredLists/${name}.json`
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                fs.open(path, 'w', function (err) {
                    if (err) return res.status(404).send(JSON.stringify(`List '${name}' Was Not Created :(`));
                    else return res.send(JSON.stringify(`List '${name}' Created Successfully`));
                });
            }
            else return res.status(404).send(JSON.stringify(`List '${name}' Already Exists`));
        });
    });


//step 7
listsRoute.route('/write/:name/:id')
    .get((req, res) => {
        const name = strip(req.params.name);
        const id = parseInt(req.params.id);
        const path = `./StoredLists/${name}.json`

        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (row) => {
            if(parseInt(row.track_id) === id) {
                fs.access(path, fs.F_OK, (err) => {
                    if (err) return res.status(404).send(JSON.stringify(`List '${name}' Does Not Exist`));
                    else {
                        let writeData = [];
                        fs.readFile(path, function(err, data) {
                            if (err) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Read`));
                            else {
                                let exst = false;
                                if(data.length>0) data = JSON.parse(data);
                                for(d of data){
                                    if(parseInt(d.track_id) === id){
                                        exst = true;
                                        break;
                                    }
                                }
                                if(!exst){
                                    writeData = data.length>0? data.concat([row]) : [row];
                                    writeData = JSON.stringify(writeData, ["track_id", "album_id", "album_title",
                                    "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
                                    "track_duration", "track_genres", "track_number", "track_title"]);
                                    fs.writeFile(path, writeData, function (error) {
                                        if (error) return res.status(404).send(JSON.stringify(`Track Id '${id}' Could Not Be Added`));
                                        else return res.send(JSON.stringify(`Track Id '${id}' Successfully Added`));
                                    });
                                }
                                else return res.status(404).send(JSON.stringify(`Tracks ID '${id}' Is Already In Your List`));
                            }
                        });
                    }
                }); 
            }
        })
        .on('end', () => {if(!res.writableEnded) res.status(404).send(JSON.stringify(`Track ID '${id}' Does Not Exist`));});
    });


//step 8
listsRoute.route('/read/:name')
    .get((req, res) => {
        const name = strip(req.params.name);
        const path = `./StoredLists/${name}.json`;
        fs.access(path, fs.F_OK, (err) => {
            if(err) return res.status(404).send(JSON.stringify(`List '${name}' Does Not Exist`));
            else{
                fs.readFile(path, function(error, data) {
                    if (error) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Read`));
                    else {
                        if(data.length === 0) return res.status(404).send(JSON.stringify(`List '${name}' Is Empty`));
                        else return res.send(data);
                    }
                });
            }
        });
    });


//step 9
listsRoute.route('/delete/:name')
    .get((req, res) => {
        const name = strip(req.params.name);
        const path = `./StoredLists/${name}.json`
        fs.access(path, fs.F_OK, (err) => {
            if(err) return res.status(404).send(JSON.stringify(`List '${name}' Does Not Exist`));
            else{
                fs.unlink(path, function(error) {
                    if (error) res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Deleted`));
                    else res.send(JSON.stringify(`List '${name}' Successfully Deleted`));
                });
            }
        });
    });


//step 10
listsRoute.route('/list')
    .get((req, res) => {
        const dir = './StoredLists/'
        fs.readdir(dir, (err, files) => {
            if(err) return res.status(404).send(JSON.stringify('Lists Could Not Be Read Or Do Not Exist'));
            else if (files.length === 0) return res.status(404).send(JSON.stringify('You Have No Saved Lists'));
            else{
                let resData = [];
                let index = 0;
                for(file of files){
                    let totalTime = 0;
                    if(res.status === 404) break;
                    let path = `./StoredLists/${file}`
                    fs.readFile(path, function(error, data) {
                        let name = path.replace('./StoredLists/','').replace('.json','');
                        if (error) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Read`));
                        else {
                            resData[index] = {};
                            resData[index]['name'] = name;
                            if(data.length>0) {
                                data = JSON.parse(data);
                                resData[index]['length'] = data.length;
                                data.forEach(d => totalTime += parseInt((d.track_duration).split(':')[0])*60 + parseInt((d.track_duration).split(':')[1]));
                                resData[index]['duration'] = '' + (parseInt(totalTime/60)) + ':' + (parseInt(totalTime%60) !== 0? parseInt(totalTime%60) : '00');
                            }
                            else {
                                resData[index]['length'] = 0;
                                resData[index]['duration'] = '0:00';
                            }

                            if(res.status !== 404 && files.length === resData.length)
                                res.send(JSON.stringify(resData));
                        }
                        index++;
                    });
                }
            }
        });
    });
