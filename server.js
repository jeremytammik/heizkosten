// server.js
//
// main entry point for the heizkosten
// database application, implemented as a node.js
// REST API driven mongoDB web server.
//
// Copyright 2015-2020 by Jeremy Tammik, Autodesk Inc.

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

var app = express();

var bodyParser = require( 'body-parser' );
app.use( bodyParser.json({ limit: '1mb' }) );
app.use( bodyParser.urlencoded({ extended: true, limit: '1mb' }) );

var Person = require( './model/person' );
var Unit = require( './model/unit' );
var Cost = require( './model/cost' );
//require( './model/apartment' );
//require( './model/consumption' );
//require( './model/occupant' );

console.log( db.modelNames() );

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

app.get( '/load_sample_person_data', (req, res) => {
  
  //db.dropCollection( 'people', (err,res) => {
  //  if (err) { return console.error( err ); }
  //});

  //console.log('hi');
  //var p = new Person( {"person_id": "alexander_kem", "firstname": "alexander", "lastname": "kem", "email": "valyxa82@mail.ru", "iban": "DE41 3701 0050 0754 2455 03", "telephone": "+49 176 ????", "salutation": "herr", "street": "fecampring", "streetnr": "28", "zip": "79618", "city": "rheinfelden", "country": "deutschland"},);
  //console.log(p);
  
  var fs = require('fs');
  var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
  for (const [key, value] of Object.entries(persons)) {
    //console.log(value);
    //var p = new Person( value );
    //console.log(p);
    //p.save( (err, p) => {
    //  if (err) { return console.error(err); }
    //});
    Person.update(
      { "person_id": value.person_id },
      value, { "upsert": true }, (err,res) =>
      {
        if (err) { return console.error(err); }
        else { console.log(res); }
      }
    );
  }
  Person.countDocuments( {}, (err, count) => {
    console.log( 'there are %d people', count );
  });  
});

var units = { "001": { "hausgeld_umlagefaehig_eur": {} }};

app.post( '/hauskosten_submit', (req, res) => {
    //console.log(req.body);
    var h = req.body;
    var unit_id = h.unit;
    delete h.unit;
    var year = h.jahr;
    delete h.jahr;
    units[unit_id].hausgeld_umlagefaehig_eur[year] = h;
    var n = Object.keys(units[unit_id].hausgeld_umlagefaehig_eur).length;
    //console.log(hauskosten);
    var fs = require('fs');
    fs.writeFile( "form/units.json", JSON.stringify(units, null, 2), (err) => {
      if (err) { console.log(err); }
      else { res.send(
        '<p>Hat geklappt, vielen Dank. Hauskosten fuer '
        + unit_id + ' nun fuer ' + n.toString() + ' Jahre erfasst.</p>'
        + '<p><a href="hauskosten">Weitere Hauskosten eingeben...</a></p>');
      }
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

