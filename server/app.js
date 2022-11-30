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
const { parse } = require('node-html-parser');
const cors = require('cors');

// Create router
const genresRoute = express.Router(),
      artistsRoute = express.Router(),
      albumsRoute = express.Router(),
      tracksRoute = express.Router(),
      listsRoute = express.Router();

app.use(express.json());
app.use(cors());
app.use('/', express.static('static'));
app.use('/api/genres', genresRoute);
app.use('/api/artists', artistsRoute);
app.use('/api/albums', albumsRoute);
app.use('/api/tracks', tracksRoute);
app.use('/api/lists', listsRoute);

genresRoute.use(express.json());
artistsRoute.use(express.json());
albumsRoute.use(express.json());
tracksRoute.use(express.json());
listsRoute.use(express.json());

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

app.post('/api/playlists', (req, res) => {
    var test = {name: "jay", tracks: "2,3"}
    insertOneObj(test, "public_playlist")
    res.send(test)
})

app.delete('/api/playlists', (req, res) => {
    var myquery = {name: "jay"}
    deleteOneObj(myquery, 'public_playlist')
    res.send(myquery)
})

//////////////////  lab 3
const genresRes = [],
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

tracksRoute.route('/tt/:track_title')
    .get((req, res) => {   
        const max = 12 
        const tt = strip(req.params.track_title);
        fs.createReadStream('./dataset/raw_tracks.csv').pipe(csv())
        .on('error', (error) => {return res.status(500).send(error.message)})
        .on('data', (data) => {if((tracksRes.length<max) && (tt.length>0 && data.track_title.toLowerCase().includes(tt))) tracksRes.push(data);})
        .on('end', () => {res.send(JSON.stringify(tracksRes, ["track_id", "album_id", "album_title",
        "artist_id", "artist_name", "tags", "track_date_created", "track_date_recorded", 
        "track_duration", "track_genres", "track_number", "track_title"])); tracksRes.length=0;});
    });

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
////////////////////////