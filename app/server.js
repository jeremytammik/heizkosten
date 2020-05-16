// server.js
//
// main entry point for the heizkosten
// database application, implemented as a node.js
// REST API and UI driven mongodb web server.
//
// Copyright 2015-2020 by Jeremy Tammik, Autodesk Inc.

var pkg = require( '../package.json' );

// db

var mongoose = require( 'mongoose' );

var localMongo = true;

if(localMongo) {
  // local database
  var mongo_uri = 'mongodb://localhost/heizkosten';
} else {
  // mongolab hosted
  var mongo_uri = 'mongodb://revit:revit@ds047742.mongolab.com:47742/heizkosten';
}

mongoose.connect( mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true });

var db = mongoose.connection;

db.on( 'error', () => {
  var msg = 'unable to connect to database at ';
  throw new Error( msg + mongo_uri );
});

db.once('open', () => {
  // we're connected!
});

var Person = require( '../model/person' );
var Unit = require( '../model/unit' );
var Cost = require( '../model/cost' );
//require( './model/apartment' );
//require( './model/consumption' );
//require( './model/occupant' );

console.log( 'Database models', db.modelNames() );

// routes

var express = require('express');
var app = express();
app.use(express.static('public'));

var bodyParser = require( 'body-parser' );
app.use( bodyParser.json({ limit: '1mb' }) );
app.use( bodyParser.urlencoded({ extended: true, limit: '1mb' }) );

require( './routes' )( app );

app.get( '/', (req, res) => {
  var v = pkg.version;
  res.send( `Hello from the cloud-based heizkosten database ${v}.\n` );
  //res.sendFile(__dirname + '/index.html');  
});

app.all( '*', (req, res) => {
  res.status( 404 ).send( `not found` );
});

//console.log( 'process.env.PORT=' + process.env.PORT );
app.set( 'port', process.env.PORT || 3001 ); // 3001 for mongoose
//app.set( 'port', 5000 ); // 5000 for express/react

var server = app.listen(
  app.get( 'port' ), () => {
    require('dns').lookup(
      require('os').hostname(), (err, addr, fam) => {
        var v = pkg.version;
        var p = server.address().port;
        var lr = localMongo ? 'local' : 'remote';
        console.log(
          `Heizkosten server version ${v}`
          + ` listening at port ${p} with ${lr}`
          + ` mongodb:\nhttp://${addr}:${p}/hauskosten.html` );
      }
    )
  }
);
