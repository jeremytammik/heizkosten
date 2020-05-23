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
  load_data_for_model,
  save_data_for_model } = require('../model/datautil');

const {
  success_with_document_count,
  jtformgen_confirm_delete,
  jtformgen_list_documents } = require('../form/jtformgen');

app.get( '/', (req, res) => {
  Person.find( {}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      return res.send( jtformgen_list_documents(
        Person, '', results, false ) );
    }
  });
});

app.get( '/load_data', (req, res) => {
  return load_data_for_model( Person, res, req );
});

app.get( '/save_data', (req, res) => {
  return save_data_for_model( Person, res, req );
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Person.find( {'units': {$in : [uid]}}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var url_filter = `/person/unit/${uid}/list`;
      return res.send( jtformgen_list_documents(
        Person, ` in ${uid}`, results, false, url_filter ) );
    }
  });
});

app.post( '/unit/:uid/list', (req, res) => {
  console.log('body', req.body);
  var uid = req.params.uid;
  Person.find( {'units': {$in : [uid]}}, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var url_filter = `/person/unit/${uid}/list`;
      return res.send( jtformgen_list_documents(
        Person, ` in ${uid}`, results, false, url_filter ) );
    }
  });
});

app.get( '/:id', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Person.get_edit_form_html( doc, 'view' );
      res.send( form );
    }
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Person.get_edit_form_html( doc, 'edit' );
      res.send( form );
    }
  });
});

app.post( '/:id/edit_submit', (req, res) => {
  var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var person = new Person( p );
  error = person.validateSync();
  if( error ) {
    var form = Person.get_edit_form_html( doc, 'edit', error );
    return res.send( form );      
  }
  var id = req.params.id;
  Person.updateOne( { "_id": id }, p, (err,res2) => {
    if (err) { return console.error(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count(
        count.toString(), Person.thing_en ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Person.find( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    else {
      var doc = results[0]._doc;
      var form = Person.get_edit_form_html( doc, 'dupl' );
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
      var form = Person.get_edit_form_html( req.body, 'dupl', error );
      return res.send( form );
    }
    var person = new Person( p );
    error = person.validateSync();
    if( error ) {
      var form = Person.get_edit_form_html( doc, 'dupl', error );
      return res.send( form );      
    }
    Person.create( req.body, (err2,res2) => {
      if (err2) {
        return console.error(err2);
      }
      Person.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( success_with_document_count( count.toString(), Person.thing_en ) );
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
      res.send( jtformgen_confirm_delete( Person, s, id ) );
    }
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Person.deleteOne( {'_id': id }, (err, results) => {
    if (err) { return console.log(err); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { return console.error(err); }
      return res.send( success_with_document_count( count.toString(), Person.thing_en ) );
    });
  });
});
