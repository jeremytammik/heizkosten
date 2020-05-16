// server.js
//
// main entry point for the heizkosten
// database application, implemented as a node.js
// REST API and UI driven mongodb web server.
//
// Copyright 2015-2020 by Jeremy Tammik, Autodesk Inc.

var pkg = require( '../package.json' );

var mongoose = require( 'mongoose' );

var localdb = true;

var mongo_uri = localdb
  ? 'mongodb://localhost/heizkosten'
  : 'mongodb://revit:revit@ds047742.mongolab.com:47742/heizkosten';

mongoose.connect( mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;

db.on( 'error', () => {
  var msg = 'unable to connect to database at ';
  throw new Error( msg + mongo_uri );
});

const express = require('express');
const bodyParser = require( 'body-parser' );
const routes = require('./routes');

const app = express();

app.use( express.static('public') );
app.use( bodyParser.json({ limit: '1mb' }) );
app.use( bodyParser.urlencoded({ extended: true, limit: '1mb' }) );
app.use( routes );

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
