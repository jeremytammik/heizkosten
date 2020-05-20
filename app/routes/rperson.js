const app = module.exports = require('express')();

const util = require( '../calc/util' );
const Person = require( '../model/person' );
const PersonService = require( '../controller/person_v1' );

app.get('/api/v1/person', PersonService.findAll);
app.get('/api/v1/person/:id', PersonService.findById);
app.post('/api/v1/person', PersonService.add);
app.put('/api/v1/person/:id', PersonService.update);
app.delete('/api/v1/person/:id', PersonService.delete);
app.get('/api/v1/person/unit/:uid', PersonService.findAllForUnit);

const {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents } = require('../form/jtformgen.js');

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Person.find( {'units': {$in : [uid]}}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        'person', ` in ${uid}`, results, false ) );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Person.get_edit_form_html( doc, false );
      res.send( form );
    }
  });
});

app.post( '/:id/edit_submit', (req, res) => {
  var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var person = new Person( p );
  error = person.validateSync();
  if( error ) {
    var form = Person.get_edit_form_html( doc, false, error );
    return res.send( form );      
  }
  var id = req.params.id;
  Person.updateOne( { "_id": id }, p, (err,res2) => {
    if (err) { return console.error(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count(
        count.toString(), 'person' ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Person.get_edit_form_html( doc, true );
      res.send( form );
    }
  });
});

app.post( '/:id/dupl_submit', (req, res) => {
  var id_original = req.params.id;
  var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var id = p._id;
  Person.countDocuments( {'_id': id }, (err, count) => {
    if (err) {
      return console.error(err);
    }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id' }}};
      var form = Person.get_edit_form_html( req.body, true, error );
      return res.send( form );
    }
    var person = new Person( p );
    error = person.validateSync();
    if( error ) {
      var form = Person.get_edit_form_html( doc, true, error );
      return res.send( form );      
    }
    Person.create( req.body, (err2,res2) => {
      if (err2) {
        return console.error(err2);
      }
      Person.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( success_with_document_count( count.toString(), 'person' ) );
      });
    });
  });
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var s = results[0].get_display_string();
      res.send( jtformgen_confirm_delete(
        Person.route, Person.thing_display, s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Person.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count( count.toString(), 'person' ) );
    });
  });
});

app.get( '/load_sample_data', (req, res) => {
  var fs = require('fs');
  var persons = JSON.parse(
    fs.readFileSync(
      'data/person.json', 'utf8' ));
  
  Person.deleteMany( {}, (err) => {
    if (err) { return console.error(err); }
    Person.create( Object.values(persons), (err,res2) => {
      if (err) { return console.error(err); }
      Person.countDocuments( {}, (err, count) => {
        if (err) { return console.error(err); }
        return res.send( success_with_document_count( count.toString(), 'person' ) );
      });
    });
  });
});

app.get( '/save_sample_data', (req, res) => {
  Person.find( {}, function( err, docs ) {
    if (err) { return console.error(err); }
    var persons = {};
    docs.forEach( (doc) => {
      var p = doc._doc;
      delete p['__v'];
      persons[p._id] = p;
    });
    var fs = require('fs');
    var fn = 'data/tmp/person.json';
    fs.writeFile( fn,
      JSON.stringify( persons, null, 2 ), 'utf8',
      function (err) {
        if (err) { return console.log(err); }
        return res.send( `Person data saved in '${fn}'` );
      }
    );
  });
});

app.get( '/create_sendfile', (req, res) => {
  const path = require('path');
  const pub = path.join( __dirname, '../../public' );
  console.log( '__dir', __dirname, 'pub', pub );
  return res.sendFile( path.join( pub, 'person.html'));
});

app.post( '/create_new_submit', (req, res) => {
    var p = req.body;
    var person = new Person( p );
    error = person.validateSync();
    if( error ) {
      var form = Person.get_edit_form_html(
        doc, Person.thing_display, false, error );
      return res.send( form );      
    }
    Person
      .create( p )
      .then( person =>
        Person.countDocuments( {}, (err, count) => {
          if (err) { return console.error(err); }
          return res.send( success_with_document_count( count.toString(), 'person' ) );
        }));
});
