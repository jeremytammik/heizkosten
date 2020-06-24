const app = module.exports = require('express')();
const util = require( '../calc/util' );
const datautil = require('../model/datautil');
const jtformgen = require('../form/jtformgen');
const Person = require( '../model/person' );
const PersonService = require( '../controller/person_v1' );

app.get('/api/v1/person', PersonService.findAll);
app.get('/api/v1/person/:id', PersonService.findById);
app.post('/api/v1/person', PersonService.add);
app.put('/api/v1/person/:id', PersonService.update);
app.delete('/api/v1/person/:id', PersonService.delete);
app.get('/api/v1/person/unit/:uid', PersonService.findAllForUnit);

app.get( '/', (req, res) => {
  Person.find( {}, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    return res.send( jtformgen.jtformgen_list_documents(
      Person, '', results, false, true ) );
  });
});

app.get( '/load_data', (req, res) => {
  return datautil.load_data_for_model( Person, res, req );
});

app.get( '/save_data', (req, res) => {
  return datautil.save_data_for_model( Person, res, req );
});

app.get( '/load_tenant', (req, res) => {
  return datautil.load_tenant_data_for_model( Person, res, req );
});

app.get( '/unit/:uid/list', (req, res) => {
  var uid = req.params.uid;
  Person.find( {'units': {$in : [uid]}}, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    var url_filter = `/person/unit/${uid}/list`;
    return res.send( jtformgen.jtformgen_list_documents(
      Person, ` in ${uid}`, results, false, true, url_filter ) );
  });
});

app.post( '/unit/:uid/list_filtering_using_mongodb_text_search', (req, res) => { // _filtering_using_mongodb_text_search
  var uid = req.params.uid;
  var sfilter = req.body.filter;
  Person.find( { 'units': {$in : [uid]}, $text: { $search : sfilter } },
    (err, results) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      var url_filter = `/person/unit/${uid}/list`;
      var matching = sfilter
        ? ` matching "${sfilter}"`
        : '';
      return res.send( jtformgen.jtformgen_list_documents(
        Person, `${matching} in ${uid}`, results,
        false, true, url_filter, sfilter ) );
    }
  );
});

app.post( '/unit/:uid/list', (req, res) => { // list_filtering_using_match
  var uid = req.params.uid;
  var sfilter = req.body.filter;
  var sfilter2 = sfilter ? sfilter : '.*'; // avoid mongo error on empty filter string
  var o = {};

  o.map = `function () {\
var s = this.firstname + ' ' + this.lastname + ' ' + this.email\
+ ' ' + this.telephone + ' ' + this.street + ' ' + this.streetnr\
+ ' ' + this.zip + ' ' + this.city + ' ' + this.country;\
emit( this._id, /${sfilter2}/i.test(s) );\
};`;

  o.reduce = 'function (k, vals) { return Array.sum(vals); };';
  o.query = { units : {$in : [uid]}};
  Person.mapReduce( o, function (err, results) {
    if (err) { console.error(err); return res.send(err.toString()); }
    var ids = [];
    results.results.forEach( (r) => {
      if( r.value ) { ids.push( r._id ); }
    });
    Person.find( { '_id': {$in : ids} }, (err, results) => {
      var url_filter = `/person/unit/${uid}/list`;
      var matching = sfilter
        ? ` matching "${sfilter}"`
        : '';
      return res.send( jtformgen.jtformgen_list_documents(
        Person, `${matching} in ${uid}`, results,
        false, true, url_filter, sfilter ) );
    });
  });
});

app.get( '/:id', (req, res) => {
  var id = req.params.id;
  //Person.find( {'_id': id }, (err, results) => {})
  Person.findById( id, (err, result) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    var form = Person.get_edit_form_html( result._doc, 'view' );
    res.send( form );
  });
});

app.get( '/:id/edit', (req, res) => {
  var id = req.params.id;
  Person.findById( id, (err, result) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    var form = Person.get_edit_form_html( result._doc, 'edit' );
    res.send( form );
  });
});

app.post( '/:id/edit_submit', (req, res) => {
  var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var person = new Person( p );
  error = person.validateSync();
  if( error ) {
    var form = Person.get_edit_form_html( p, 'edit', error );
    return res.send( form );      
  }
  var id = req.params.id;
  Person.updateOne( { "_id": id }, p, (err,res2) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      return res.send( jtformgen.success_with_document_count(
        '', count.toString(), Person.thing_en ) );
    });
  });
});

app.get( '/:id/dupl', (req, res) => {
  var id = req.params.id;
  Person.findById( id, (err, result) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    var form = Person.get_edit_form_html( result._doc, 'dupl' );
    res.send( form );
  });
});

app.post( '/:id/dupl_submit', (req, res) => {
  var id_original = req.params.id;
  var p = util.trimAllFieldsInObjectAndChildren( req.body );
  var id = p._id;
  Person.countDocuments( {'_id': id }, (err, count) => {
    if (err) {
      console.error(err); return res.send(err.toString());
    }
    if( 0 < count ) {
      var error = { 'errors': { '_id': {
        'path': '_id', 'message': 'duplicate id' }}};
      var form = Person.get_edit_form_html( req.body, 'dupl', error );
      return res.send( form );
    }
    var a = new Person( p );
    error = a.validateSync();
    if( error ) {
      var d = a._doc;
      d._id = id_original;
      var form = Person.get_edit_form_html( d, 'dupl', error );
      return res.send( form );
    }
    p['_id'] = id;
    Person.create( p, (err2,res2) => {
      if (err2) {
        return console.error(err2);
      }
      Person.countDocuments( {}, (err3, count) => {
        if (err3) { return console.error(err3); }
        return res.send( jtformgen.success_with_document_count(
          '', count.toString(), Person.thing_en ) );
      });
    });
  });
});

app.get( '/:id/del', (req, res) => {
  var id = req.params.id;
  Person.findById( id, (err, result) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    var s = result.get_display_string();
    res.send( jtformgen.jtformgen_confirm_delete( Person, s, id ) );
  });
});

app.get( '/:id/del_confirmed', (req, res) => {
  var id = req.params.id;
  Person.deleteOne( {'_id': id }, (err, results) => {
    if (err) { console.error(err); return res.send(err.toString()); }
    Person.countDocuments( {}, (err, count) => {
      if (err) { console.error(err); return res.send(err.toString()); }
      return res.send( jtformgen.success_with_document_count(
        '', count.toString(), Person.thing_en ) );
    });
  });
});
