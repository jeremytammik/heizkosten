// server.js
//
// main entry point for a cloud-based firerating
// database application, implemented as a node.js
// REST API driven mongoDB web server.
//
// Copyright 2015-2016 by Jeremy Tammik, Autodesk Inc.

var pkg = require( './package.json' );
var express = require('express');
var mongoose = require( 'mongoose' );

var localMongo = true;

if(localMongo) {
  // local database
  var mongo_uri = 'mongodb://localhost/heizkosten';
} else {
  // mongolab hosted
  var mongo_uri = 'mongodb://revit:revit@ds047742.mongolab.com:47742/heizkosten';
}

mongoose.connect( mongo_uri );
var db = mongoose.connection;
db.on( 'error', function () {
  var msg = 'unable to connect to database at ';
  throw new Error( msg + mongo_uri );
});

var app = express();

var bodyParser = require( 'body-parser' );
app.use( bodyParser.json({ limit: '1mb' }) );
app.use( bodyParser.urlencoded({ extended: true, limit: '1mb' }) );

//require( './model/apartment' );
//require( './model/consumption' );
//require( './model/occupant' );
//require( './model/unit' );

//require( './routes' )( app );

app.get( '/', (req, res) => {
  res.send(
    'Hello from the cloud-based heizkosten ' +
    ' database ' + pkg.version + '.\n' );
  //res.sendFile(__dirname + '/index.html');  
});

app.get( '/hauskosten', (req, res) => {
  res.sendFile(__dirname + '/form/hauskosten.html');
});

hauskosten = {};

app.post( '/hauskosten_submit', (req, res) => {
    //console.log(req.body);
    var h = req.body;
    var year = h.jahr;
    delete h.jahr;
    hauskosten[year] = h;
    var n = Object.keys(hauskosten).length;
    //console.log(hauskosten);
    var fs = require('fs');
    fs.writeFile( "hauskosten.json", JSON.stringify(hauskosten, null, 2), (err) => {
      if (err) { console.log(err); }
      else { res.send(
        '<p>Hat geklappt, vielen Dank. Hauskosten nun fuer '
        + n.toString() + ' Jahre erfasst.</p>'
        + '<p><a href="hauskosten">Weitere Hauskosten eingeben...</a></p>'); }
    });    
});

app.get('/express_backend', (req, res) => {
  res.send({ express: 'express backend is connected to react' });
});

//console.log( 'process.env.PORT=' + process.env.PORT );
//app.set( 'port', process.env.PORT || 3001 ); // 3001 for mongoose
app.set( 'port', 5000 ); // 5000 for express/react

var server = app.listen(
  app.get( 'port' ),
  function() {
    console.log(
      'Heizkosten server ' + pkg.version +
      ' listening at port ' + server.address().port +
      ' with ' + (localMongo ? 'local' : 'remote') +
      ' mongodb: http://localhost:5000/hauskosten');
  }
);

