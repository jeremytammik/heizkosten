const app = module.exports = require('express')();

var Person = require( '../model/person' );

var PersonService = require( '../controller/person_v1' );
app.get('/api/v1/person', PersonService.findAll);
app.get('/api/v1/person/:id', PersonService.findById);
app.post('/api/v1/person', PersonService.add);
app.put('/api/v1/person/:id', PersonService.update);
app.delete('/api/v1/person/:id', PersonService.delete);
app.get('/api/v1/person/unit/:uid', PersonService.findAllForUnit);

app.get( '/unit/:uid/list', (req, res) => {
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

app.get( '/:id/edit', (req, res) => {
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

app.post( '/:id/edit_submit', (req, res) => {
  var id = req.params.id;
  Person.updateOne( { "_id": id }, req.body, (err,res2) => {
    if (err) { return console.error(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
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

app.post( '/:id/dupl_submit', (req, res) => {
  var id = req.params.id;
  Person.create( req.body, (err,res2) => {
    if (err) { return console.error(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

const { jtformgen_confirm_delete } = require('../form/jtformgen.js');

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen_confirm_delete( s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Person.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});

app.get( '/load_sample_data', (req, res) => {
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

/*
app.get( '/css/heizkosten.css', (req, res) => {
  console.log(req);
  const dircss = __dirname + '/../../public/css/';
  console.log( '__dir', __dirname, 'css', dircss );
  return res.sendFile( dircss + 'heizkosten.css' );
});
*/

app.get( '/create_sendfile', (req, res) => {
  const path = require('path');
  const pub = path.join( __dirname, '../../public' );
  console.log( '__dir', __dirname, 'pub', pub );
  return res.sendFile( path.join( pub, 'person.html'));
});

app.post( '/create_new_submit', (req, res) => {
  var p = req.body;
  p.units = p.units.split(',');
  
  Person.updateOne( { "_id": p._id },
    p, { "upsert": true }, (err,res2) => {
      if (err) { return console.error(err);
    }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_person_count_string( count.toString() ) );
    });
  });
});
