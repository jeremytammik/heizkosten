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

require( './routes' )( app );

app.get( '/', (req, res) => {
  res.send(
    'Hello from the cloud-based heizkosten ' +
    ' database ' + pkg.version + '.\n' );
  //res.sendFile(__dirname + '/index.html');  
});

app.get( '/hauskosten', (req, res) => {
  res.sendFile(__dirname + '/form/hauskosten.html');
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
      + '<p><a href="/hauskosten">Weitere Hauskosten eingeben...</a></p>');
    }
  });    
});

app.get( '/person/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Person.find( {'units': {$in : [uid]}}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var a = [];
      results.forEach( (p) => { a.push(
        '<li>' + p.firstname + ' ' + p.lastname + ' ' + p.salutation + ' '
        + p.street + ' ' + p.streetnr + ' ' + p.zip + ' ' + p.city + ' ' + p.country
        + ' &ndash; <a href="/person/' + p._id + '/edit">edit</a></li>' );
      });
      a.sort();
      a.reverse();
      a.push( '<head><style> body { font-family: sans-serif; font-size: small }</style></head>' );
      a.push( '<body><p>' + a.length.toString() + ' persons:</p><ul>' );
      a.reverse();
      a.push( '</ul><p><a href="/hauskosten">return to hauskosten</a></p></body>' );
      return res.send( a.join('\n') );
    }
  });
});

function generate_person_edit_form_html(p)
{
  var id = p['_id'];
  delete p['person_id'];
  delete p['_id'];
  delete p['__v'];
  delete p['units'];

  var s1 = `\
<head>\
	<meta charset="utf-8" />\
	<title>Edit Person Data</title>\
  <style>\
    body, td, label { font-family: sans-serif; font-size: small }\
    td { text-align: right }\
    table { border: 1px solid black }\
  </style>\
</head>\
\
<body>\
  <p>Person editieren:</p>\
  <form action="/person/${id}/edit_submit" method="POST">\
    <table>\
`;

var a = [];
Object.keys(p).forEach( (key,index) => {
  var k = key;
  var v = p[key];
  a.push( `\ 
<tr>\
<td><label for="${k}">${k}:</label></td>\
<td><input type="string" maxlength="30" size="30" placeholder="${k}" id="${k}" name="${k}" value="${v}"></td>\
</tr>\
` );
});
console.log(a);

var s2 = a.join('\n');

var s3 = '\
        <tr>\
          <td colspan="2" style="text-align: center">\
            <button type="submit">Speichern</button>\
          </td>\
        </tr>\
      </table>\
    </form>\
  </body>\
</html>\
';

return s1 + s2 + s3;
}

app.get( '/person/:id/edit', (req, res) => {
  console.log(req.params);
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    console.log(err, results);
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = generate_person_edit_form_html(doc);
      console.log(form);
      res.send( form );
    }
  });
});

app.post( '/person/:id/edit_submit', (req, res) => {
  var id = req.params.id;
  console.log(req.body);
  Person.updateOne(
    { "_id": id }, req.body, (err,res) => {
      if (err) { return console.error(err); }
  });
  Person.countDocuments( {}, (err, count) => {
    if (err) { return console.error(err); }
    console.log( 'Database contains %d people', count );
    return res.send(
      '<p>Hat geklappt, vielen Dank. '
      + 'Database now contains ' + count.toString() + ' people.</p>'
      + '<p><a href="/hauskosten">Weiter Hauskosten erfassen...</a></p>');
  });
});

app.get( '/person/load_sample_person_data', (req, res) => {
  var fs = require('fs');
  var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
  for (const [key, value] of Object.entries(persons)) {
    Person.updateOne(
      { "person_id": value.person_id },
      value, { "upsert": true }, (err,res) => {
        if (err) { return console.error(err); }
    });
  }
  Person.countDocuments( {}, (err, count) => {
    if (err) { return console.error(err); }
    console.log( 'Database contains %d people', count );
    return res.send(
      '<p>Hat geklappt, vielen Dank. '
      + 'Database now contains ' + count.toString() + ' people.</p>'
      + '<p><a href="/hauskosten">Weiter Hauskosten erfassen...</a></p>');
  });
});

app.get( '/person/create_new', (req, res) => {
  res.sendFile(__dirname + '/form/person.html');
});

app.post( '/person/create_new_submit', (req, res) => {
  console.log(req.body);
  var p = req.body;
  p.units = p.units.split(',');
  
  Person.updateOne(
    { "person_id": p.person_id }, p,
    { "upsert": true }, (err,res) => {
      if (err) { return console.error(err); }
  });

  Person.countDocuments( {}, (err, count) => {
    if (err) { return console.error(err); }
    console.log( 'Database contains %d people', count );
    return res.send(
      '<p>Hat geklappt, vielen Dank. '
      + 'Database now contains ' + count.toString() + ' people.</p>'
      + '<p><a href="/person/create_new">Weitere Personendaten erfassen...</a></p>');
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
