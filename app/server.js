// server.js
//
// main entry point for node.js REST API
// and UI driven mongodb web server.
//
// Copyright 2015-2020 by Jeremy Tammik, Autodesk Inc.

var pkg = require( '../package.json' );

var mongoose = require( 'mongoose' );

// suppress DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.

mongoose.set( 'useNewUrlParser', true );
mongoose.set( 'useFindAndModify', false );
mongoose.set( 'useCreateIndex', true );

var localdb = true;

var mongo_uri = localdb
  ? 'mongodb://localhost/herucoal'
  : 'mongodb://revit:revit@ds047742.mongolab.com:47742/herucoal';

var mongo_opt = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

mongoose.connect( mongo_uri, mongo_opt );

var db = mongoose.connection;

// mongodb connection events

// when successfully connected
db.on( 'connected', function () {
  console.log( 'Mongoose default connection open to '
    + mongo_uri );
}); 
  
// connection throws an error
db.on( 'error', function (err) { 
  console.log( 'Mongoose default connection error: ' + err );
  //var msg = 'unable to connect to database at ' + mongo_uri;
  //console.log( msg );
  //throw new Error( msg );
}); 

// connection is disconnected
db.on( 'disconnected', function () { 
  console.log( 'Mongoose default connection disconnected' ); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {   
  db.close( function () { 
    console.log( 'Mongoose default connection disconnected through app termination' ); 
    process.exit( 0 ); 
  }); 
});

const express = require('express');
const bodyParser = require( 'body-parser' );
const routes = require('./routes');

const app = express();

const pub = __dirname + '/../public';
//console.log( '__dir', __dirname, 'pub', pub );

app.use( express.static( pub ) );
app.use( bodyParser.json({ limit: '1mb' }) );
app.use( bodyParser.urlencoded({ extended: true, limit: '1mb' }) );
app.use( routes );

console.log( 'Database models loaded:',
  mongoose.modelNames().join( ', ' ) );

app.set( 'port', process.env.PORT || 3001 );

var server = app.listen(
  app.get( 'port' ), () => {
    require('dns').lookup(
      require('os').hostname(), (err, addr, fam) => {
        var v = pkg.version;
        var p = server.address().port;
        var lr = localdb ? 'local' : 'remote';
        console.log(
          `Heizkosten server version ${v}`
          + ` listening at port ${p} with ${lr}`
          + ` mongodb:\nhttp://${addr}:${p}/hauskosten.html` );
      }
    )
  }
);
