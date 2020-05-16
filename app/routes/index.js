var app = module.exports = require('express')();

app.get( '/', (req, res) => {
  var v = pkg.version;
  res.send( `Hello from the cloud-based heizkosten database ${v}.\n` );
  //res.sendFile(__dirname + '/index.html');  
});

var Person = require( '../../model/person' );
var Unit = require( '../../model/unit' );
var Cost = require( '../../model/cost' );
//require( './model/apartment' );
//require( './model/consumption' );
//require( './model/occupant' );

var mongoose = require( 'mongoose' );

console.log( 'Database models', mongoose.connection.modelNames() );

var PersonService = require( '../../controller/person_v1' );
app.get('/api/v1/person', PersonService.findAll);
app.get('/api/v1/person/:id', PersonService.findById);
app.post('/api/v1/person', PersonService.add);
app.put('/api/v1/person/:id', PersonService.update);
app.delete('/api/v1/person/:id', PersonService.delete);
app.get('/api/v1/person/unit/:uid', PersonService.findAllForUnit);

app.get( '/person/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Person.find( {'units': {$in : [uid]}}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var a = [];
      results.forEach( (p) => { a.push(
        '<li>' + p.get_display_string()
        + ' &ndash; <a href="/person/' + p._id + '/edit">edit</a>'
        + ' &ndash; <a href="/person/' + p._id + '/dupl">dupl</a>'
        + ' &ndash; <a href="/person/' + p._id + '/del">del</a></li>' );
      });
      var n = a.length.toString();
      a.sort();
      a.reverse();
      a.push( '<head><style> body { font-family: sans-serif; font-size: small }</style></head>' );
      a.push( `<body><p>${n} persons associated with unit ${uid}:</p><ul>` );
      a.reverse();
      a.push( '</ul><p><a href="/hauskosten.html">return to hauskosten</a></p></body>' );
      return res.send( a.join('\n') );
    }
  });
});

function success_with_person_count_string(n)
{
  return '<p>Hat geklappt, vielen Dank. '
    + `Database now contains ${n} people.</p>`
    + '<p><a href="/hauskosten.html">Weiter Hauskosten erfassen...</a></p>';
}

app.get( '/person/:id/edit', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      //var form = generate_person_edit_form_html(doc, false);
      //var form = doc.get_edit_form_html();
      var form = Person.get_edit_form_html( doc, false );
      res.send( form );
    }
  });
});

app.post( '/person/:id/edit_submit', (req, res) => {
  var id = req.params.id;
  Person.updateOne( { "_id": id }, req.body, (err,res2) => {
    if (err) { return console.error(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

app.get( '/person/:id/dupl', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      //var form = person_get_edit_form_html(doc, true);
      //var form = doc.get_dupl_form_html();
      var form = Person.get_edit_form_html( doc, true );
      res.send( form );
    }
  });
});

app.post( '/person/:id/dupl_submit', (req, res) => {
  var id = req.params.id;
  Person.create( req.body, (err,res2) => {
    if (err) { return console.error(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

app.get( '/person/:id/del', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      var html = '<p>Sollen die Daten der folgenden Person wirklich geloescht werden?</p>'
        + `<ul><li>${s}</li></ul>`
        + `<a href="/person/${id}/del_confirmed">Ja</a> &ndash; `
        + '<a href="/hauskosten.html">Nein</a>';
      res.send( html );
    }
  });
});

app.get( '/person/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Person.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

app.get( '/person/load_sample_person_data', (req, res) => {
  var fs = require('fs');
  var persons = JSON.parse(fs.readFileSync('data/person.json', 'utf8'));
  
  Person.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    Person.create( Object.values(persons), (err,res2) => {
      if (err) { return console.error(err); }
      Person.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_person_count_string( count.toString() ) );
      });
    });
  });
});

app.post( '/person/create_new_submit', (req, res) => {
  var p = req.body;
  p.units = p.units.split(',');
  
  Person.updateOne( { "person_id": p.person_id },
    p, { "upsert": true }, (err,res2) => {
      if (err) { return console.error(err);
    }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

var CostService = require( '../../controller/cost_v1' );
app.get('/api/v1/cost', CostService.findAll);
app.get('/api/v1/cost/:id', CostService.findById);
app.post('/api/v1/cost', CostService.add); // is this used any longer at all, now that update3 is available?
//app.post('/api/v1/cost', CostService.insertBatch); // add multiple records
app.put('/api/v1/cost/:id', CostService.update3); // added {upsert:true} option
app.delete('/api/v1/cost/:id', CostService.delete);
app.get('/api/v1/cost/unit/:uid', CostService.findAllForUnit);
app.delete('/api/v1/cost/unit/:uid', CostService.deleteAllForUnit);

var units = { "001": { "hausgeld_umlagefaehig_eur": {} }};

app.post( '/hauskosten_submit', (req, res) => {
  var h = req.body;
  var unit_id = h.unit;
  delete h.unit;
  var year = h.jahr;
  delete h.jahr;
  units[unit_id].hausgeld_umlagefaehig_eur[year] = h;
  var n = Object.keys(units[unit_id].hausgeld_umlagefaehig_eur).length;
  var fs = require('fs');
  fs.writeFile( "form/units.json", JSON.stringify(units, null, 2), (err) => {
    if (err) { console.log(err); }
    else { res.send(
      '<p>Hat geklappt, vielen Dank. Hauskosten fuer '
      + unit_id + ' nun fuer ' + n.toString() + ' Jahre erfasst.</p>'
      + '<p><a href="/hauskosten.html">Weitere Hauskosten eingeben...</a></p>');
    }
  });    
});

app.all( '*', (req, res) => {
  res.status( 404 ).send( `not found` );
});
